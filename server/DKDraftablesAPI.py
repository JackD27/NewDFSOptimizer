import requests
import pandas as pd

class DKDraftables:
    
    def getDKDraftables(self, group):

        draft_group = group

        website_url = f'https://api.draftkings.com/draftgroups/v1/draftgroups/{draft_group}/draftables'
        #     # json response
        response = requests.get(url=website_url).json()

        contest_info = response['draftables']


        nbaDf = pd.DataFrame(contest_info)
        nbaDf = nbaDf.loc[:,["draftableId", 'displayName', 'playerId', 'playerDkId', 'position', 'rosterSlotId', 'salary', 'status', 'playerImage160', 'draftStatAttributes', 'teamAbbreviation']]
        testing1 = nbaDf[['draftStatAttributes', 'draftableId']]
        testing = pd.json_normalize(testing1.draftStatAttributes)
        testing.columns = ['idk', 'useless']
        final2 = pd.json_normalize(testing.idk)
        final = pd.merge(final2, testing1['draftableId'], left_index=True, right_index=True)
        final = final[['value', 'draftableId']]
        final4 = pd.merge(nbaDf, final).drop(columns=['draftStatAttributes'])
        final4.loc[final4['value'].str.contains('th') | (final4['status'] == 'OUT'), 'value'] = 0
        return final4