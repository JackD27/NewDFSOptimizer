import pandas as pd
import numpy as np

import requests


class NBAScraper():
    def nba_props_dk(self):
        games = {}
        for cat in range(1215, 1220):
            dk_api = requests.get(
                f"https://sportsbook.draftkings.com//sites/US-NJ-SB/api/v5/eventgroups/42648/categories/{cat}?format=json").json()
            for i in dk_api['eventGroup']['offerCategories']:
                if 'offerSubcategoryDescriptors' in i:
                    dk_markets = i['offerSubcategoryDescriptors']

            subcategoryIds = []  # Need subcategoryIds first
            for i in dk_markets:
                subcategoryIds.append(i['subcategoryId'])

            for ids in subcategoryIds:
                dk_api = requests.get(
                    f"https://sportsbook.draftkings.com//sites/US-NJ-SB/api/v5/eventgroups/42648/categories/{cat}/subcategories/{ids}?format=json").json()
                for i in dk_api['eventGroup']['offerCategories']:
                    if 'offerSubcategoryDescriptors' in i:
                        dk_markets = i['offerSubcategoryDescriptors']

                for i in dk_markets:
                    if 'offerSubcategory' in i:
                        market = i['name']
                        for j in i['offerSubcategory']['offers']:
                            for k in j:
                                if 'participant' in k['outcomes'][0]:
                                    player = k['outcomes'][0]['participant']
                                else:
                                    continue

                                if player not in games:
                                    games[player] = {}

                                try:
                                    games[player][market] = {'market': market, 
                                                             'over': k['outcomes'][0]['line']}
                                    
                                    
                                except:
                                    # print(player, market)
                                    pass

        return games
    
df = pd.DataFrame(NBAScraper().nba_props_dk())

df.to_csv('nba_propsNonEdit.csv', index=False)


df = df.stack().droplevel(0).reset_index().rename(columns={'index': 'Name', 0:'data'})
testing = pd.json_normalize(df.data)
testing.columns = ['market', 'over']
final = pd.merge(df, testing, left_index=True, right_index=True).drop(columns=['data'])

result = pd.DataFrame()
result['Name'] = final['Name']


final.loc[(final['market'] == 'Points'), 'Points'] = final['over']
final.loc[(final['market'] == 'Rebounds'), 'Rebounds'] = final['over']
final.loc[(final['market'] == 'Assists'), 'Assists'] = final['over']
final.loc[(final['market'] == 'Threes'), '3 Pointers'] = final['over']
final.loc[(final['market'] == 'Steals + Blocks'), 'StealsBlocks'] = final['over']
# result['Rebounds'] = final.loc[final['market'] == 'Rebounds', 'over']
# result['Assists'] = final.loc[final['market'] == 'Assists', 'over']
# result['Points'] = final.loc[final['market'] == 'Points', 'over']
# result['3 Pointers'] = final.loc[final['market'] == 'Threes', 'over']
# result['StealsBlocks'] = final.loc[final['market'] == 'Steals + Blocks', 'over']

# result = result.sort_index().reset_index()
# result['Name']=result['Name'].mask(result['Name'].duplicated(),"")





result.to_csv('nba_propsChanged2.csv', index=False)

yikes = final.drop(columns=['market', 'over']).drop_duplicates(subset=['Name'], keep='first')

idk = final.groupby('Name').sum().reset_index().drop(columns=['market', 'over'])



yikes.to_csv('nba_propsChanged.csv', index=False)


idk.to_csv('kikged.csv', index=False)





