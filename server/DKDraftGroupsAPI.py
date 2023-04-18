import requests
import pandas as pd

class SportContests:
    def getSportGroupIds(self, sportName):

        sport = sportName

        website_url = f'https://www.draftkings.com/lobby/getcontests?sport={sport}'
        response = requests.get(url=website_url).json()

        contest_info = response['Contests']

        nbaDf = pd.DataFrame(contest_info)
        nbaDf = nbaDf[['n', 'dg', 'gameType', 'sdstring', 'sd']].drop_duplicates(subset=['dg'])
        nbaDf = nbaDf.loc[(nbaDf['gameType'] == 'Showdown Captain Mode') | (nbaDf['gameType'] == 'Classic')]
        stringGone = nbaDf['n'].str.extract('.*\((.*)\).*')
        nbaDf = pd.merge(nbaDf, stringGone, left_index=True, right_index=True, how='inner')
        stringGone2 = nbaDf['sd'].str.extract('.*\((.*)\).*')
        nbaDf = pd.merge(nbaDf, stringGone2, left_index=True, right_index=True, how='inner')
        nbaDf.loc[nbaDf['n'] != 'NBA', 'n'] = sport
        nbaDf.columns = ['Sport', 'DraftGroup', 'Type', 'Time', 'idk','Team', 'WholeTime']
        nbaDf['Team'] = nbaDf['Team'].fillna('N/A')
        nbaDf = nbaDf.sort_values(by='WholeTime')
        nbaDf = nbaDf[['Sport', 'DraftGroup', 'Type', 'Time', 'Team']]
        # nbaDf['WholeTime'] =pd.to_datetime(nbaDf.WholeTime)
        return nbaDf





    



