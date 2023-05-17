import NBAStats
import DKDraftablesAPI 
import DKDraftGroupsAPI
import pandas as pd
import color
import requests

class FinalCSV:
    ref = ['2022-23', 'PerGame', 'Playoffs']
    def getFinalCSV(self, sportName, season, perMode, seasonType, draftGroup):
        draftGroupsDf =  DKDraftGroupsAPI.SportContests().getSportGroupIds(sportName)

        nbaStatsDf = NBAStats.NBAStatsClass().getNBAstats(season, perMode, seasonType)
        draftablesDf = DKDraftablesAPI.DKDraftables().getDKDraftables(draftGroup)

        finalDf = pd.merge(nbaStatsDf, draftablesDf)
        finalDf.loc[finalDf['status'] == 'OUT', 'jackDKavgFPTs'] = 0


        finalDf2 = pd.merge(finalDf, draftGroupsDf)




        finalDf2['PPM'] = round(finalDf2['jackDKavgFPTs'] / finalDf2['MIN'], 2)

        finalDf2.loc[finalDf2['Type'] == 'Classic'] = finalDf2.drop_duplicates(subset='displayName')
        finalDf2 = finalDf2.join(finalDf2['position'].str.split('/', expand=True).stack().reset_index(level=1, drop=True).rename('pos')).reset_index(drop=True)
        finalDf2.loc[(finalDf2['Type'] == 'Showdown Captain Mode') & (finalDf2['rosterSlotId'] == 476), 'pos'] = 'CPT'
        finalDf2.loc[(finalDf2['Type'] == 'Showdown Captain Mode') & (finalDf2['rosterSlotId'] == 475), 'pos'] = 'UTIL'

        finalDf2 = finalDf2.dropna()
        editable = finalDf2[['displayName', 'teamAbbreviation', 'jackDKavgFPTs', 'PPM', 'playerImage160', 'Team']]
        editable = editable.drop_duplicates(subset='displayName')
        editable = editable.assign(newMins=None, newAvgPoints=None, sportsLineMins=None, sportsLineAvgPoints=None)

        return editable

        # try:
        #     word = str(finalDf2['Team'][1]).replace(" ","")
        #     editable.to_csv(word+'editThis.csv', index=False)
        # except:
        #     editable.to_csv('ClassicEditThis.csv', index=False)
