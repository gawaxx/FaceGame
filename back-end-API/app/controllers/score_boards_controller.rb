class ScoreBoardsController < ApplicationController

    def index
        scoreboards = ScoreBoard.all
        render json: scoreboards #, include: [:user]
    end 

    def show 
        scoreboard = ScoreBoard.find_by(id: params[:id])
        render json: { id: scoreboard.id, name: scoreboard.user_name, count: scoreboard.count }
    end

    def create
        new_scoreboard = ScoreBoard.create(user_id: params[:user_id], count: params[:count])
        render json: new_scoreboard
        # (User.find_by(name: params[:user_name])
    end 

end
