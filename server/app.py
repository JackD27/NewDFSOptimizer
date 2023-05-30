from flask import Flask, Response, request
from flask_cors import CORS
import final
import DKDraftGroupsAPI

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello():
    return 'Hey!'

@app.route('/getDraftGroup/<sport>', methods=['GET'])
def draftGroup(sport):
    draftGroupsDf =  DKDraftGroupsAPI.SportContests().getSportGroupIds(sport)
    return Response(draftGroupsDf.to_json(orient="records"), mimetype='application/json')

@app.route('/getEdittableCSV', methods=['POST'])
def getEdditableCSV():
    data = request.get_json()
    sportName = data['sportName']
    season = data['season']
    perMode = data['perMode']
    seasonType = data['seasonType']
    draftGroup = data['draftGroup']
    realSport = data['realSport']
    edittableCSV =  final.FinalCSV().getFinalCSV(sportName, season, perMode, seasonType, draftGroup, realSport)
    return Response(edittableCSV.to_json(orient="records"), mimetype='application/json')

if __name__ == '__main__':
    app.run()
