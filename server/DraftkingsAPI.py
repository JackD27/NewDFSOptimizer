# player_bios.py - scraps data from stats.nba.com and inserts into player_bios table within MySQL nba stats database
import requests
import pandas as pd

season = '2022-23'

#per_mode = 'Per100Possessions'
#per_mode = 'Totals'
#per_mode = 'Per36'
per_mode = 'PerGame'

season_type = 'Regular%20Season'
#season_type = 'PlayIn'
#season_type = 'Playoffs'

sport = 'NBA'
#sport = 'MLB'

website_url = f'https://www.draftkings.com/lobby/getcontests?sport={sport}'
#     # json response
response = requests.get(url=website_url).json()

contest_info = response['Contests']


def seasonNameFormatter(word):
    if word == 'Regular%20Season':
        return 'RegSeason'
    else: return word

nbaDf = pd.DataFrame(contest_info)
nbaDf = nbaDf[['n', 'dg', 'gameType', 'sdstring']].drop_duplicates(subset=['dg'])
nbaDf = nbaDf.loc[(nbaDf['gameType'] == 'Showdown Captain Mode') | (nbaDf['gameType'] == 'Classic')]
stringGone = nbaDf['n'].str.extract('.*\((.*)\).*')
nbaDf = pd.merge(nbaDf, stringGone, left_index=True, right_index=True, how='inner')
nbaDf.loc[nbaDf['n'] != 'NBA', 'n'] = sport
nbaDf.columns = ['Sport', 'GameId', 'Type', 'Time', 'Team']
nbaDf['Team'] = nbaDf['Team'].fillna('N/A')
nbaDf.to_csv('contestInfo.csv', index=False)





    



