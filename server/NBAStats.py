import requests
import pandas as pd


class NBAStatsClass:

    def getNBAstats(self, season_year, mode, type):


        headers = {
            'Connection': 'keep-alive',
            'Accept': 'application/json, text/plain, */*',
            'x-nba-stats-token': 'true',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
            'x-nba-stats-origin': 'stats',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Referer': 'https://stats.nba.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
        }

        season = season_year


        # per_mode = 'Per100Possessions'
        # per_mode = 'Totals'
        # per_mode = 'Per36'
        per_mode = mode

        season_type = type
        # season_type = 'PlayIn'
        # season_type = 'Playoffs'

        nba_url = f'https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode={per_mode}&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season={season}&SeasonSegment=&SeasonType={season_type}&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight='
        #     # json response
        response = requests.get(url=nba_url, headers=headers).json()
        #     # pulling just the data we want
        headers = response['resultSets'][0]['headers']
        player_info = response['resultSets'][0]['rowSet']
        #     # looping over data to insert into table
        #     for row in player_info:
        #             season_id=season_id,  # this is key, need this to join and sort by seasons
        #             player_id=row[1],
        #             player_name=row[2],
        #             team_id=row[3],
        #             team_abbreviation=row[4],
        #             team_name=row[5],
        #             game_id=row[6],
        #             game_date=row[7],
        #             matchup=row[8],
        #             wl=row[9],
        #             min=row[10],
        #             fgm=row[11],
        #             fga=row[12],
        #             fg_pct=row[13],
        #             fg3m=row[14],
        #             fg3a=row[15],
        #             fg3_pct=row[16],
        #             ftm=row[17],
        #             fta=row[18],
        #             ft_pct=row[19],
        #             oreb=row[20],
        #             dreb=row[21],
        #             reb=row[22],
        #             ast=row[23],
        #             stl=row[24],
        #             blk=row[25],
        #             tov=row[26],
        #             pf=row[27],
        #             pts=row[28],
        #             plus_minus=row[29],
        #             video_available=row[30]


        def seasonNameFormatter(word):
            if word == 'Regular%20Season':
                return 'RegSeason'
            else:
                return word


        nbaDf = pd.DataFrame(player_info, columns=headers)
        nbaDf = nbaDf[['PLAYER_NAME', 'TEAM_ABBREVIATION', 'GP', 'MIN',
                    'PTS', 'FGM', 'FG3M', 'FTM', 'REB', 'AST', 'TOV', 'STL', 'BLK']]
        nbaDf['possibleStud'] = 0

        nbaDf.loc[nbaDf['PTS'] >= 10, 'possibleStud'] = nbaDf['possibleStud'] + 1
        nbaDf.loc[nbaDf['REB'] >= 10, 'possibleStud'] = nbaDf['possibleStud'] + 1
        nbaDf.loc[nbaDf['AST'] >= 10, 'possibleStud'] = nbaDf['possibleStud'] + 1
        nbaDf.loc[nbaDf['STL'] >= 10, 'possibleStud'] = nbaDf['possibleStud'] + 1
        nbaDf.loc[nbaDf['BLK'] >= 10, 'possibleStud'] = nbaDf['possibleStud'] + 1

        nbaDf.loc[nbaDf['possibleStud'] == 2, 'extraPts'] = 1.5
        nbaDf.loc[nbaDf['possibleStud'] >= 3, 'extraPts'] = 3
        nbaDf.loc[nbaDf['possibleStud'] < 2, 'extraPts'] = 0


        PPGpoints = nbaDf['PTS']
        ThreesPGpoints = nbaDf['FG3M'] * .5
        RBGpoints = nbaDf['REB'] * 1.25
        APGpoints = nbaDf['AST'] * 1.5
        SPGpoints = nbaDf['STL'] * 2
        BPGpoints = nbaDf['BLK'] * 2
        TPGpoints = nbaDf['TOV'] * -0.5


        jackFPTs = PPGpoints + ThreesPGpoints + RBGpoints + APGpoints + SPGpoints + BPGpoints + TPGpoints + nbaDf['extraPts']
        nbaDf['jackDKavgFPTs'] = round(jackFPTs, 2)
        nbaDf = nbaDf[['PLAYER_NAME', 'TEAM_ABBREVIATION', 'MIN', 'jackDKavgFPTs']]
        nbaDf.rename(columns={'PLAYER_NAME': 'displayName'}, inplace=True)
        return nbaDf
