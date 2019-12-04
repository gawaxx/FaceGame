class ScoreBoardsController < ApplicationController

    def index
        scoreboards = ScoreBoard.all
        render json: scoreboards
    end 

    def show 
        scoreboard = ScoreBoard.find_by(id: params[:id])
        render json: scoreboard
    end

end
