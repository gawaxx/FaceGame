class ScoreBoardsController < ApplicationController

    def index
        scoreboards = ScoreBoard.all
        render json: scoreboards
    end 

    def show 
        scoreboard = ScoreBoard.find_by(id: params[:id])
        render json: { id: scoreboard.id, name: scoreboard.user.name, count: scoreboard.count }
    end

    def create
        new_scoreboard = ScoreBoard.new 
        new_scoreboard.user_id = params[:user_id]
        new_scoreboard.count = params[:count]
        render json: new_scoreboard
    end 

end
