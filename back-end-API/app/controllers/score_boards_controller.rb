class ScoreBoardsController < ApplicationController

    def index
        scoreboards = ScoreBoard.all
        render json: scoreboards #, include: [:user]
    end 

    def show 
        scoreboard = ScoreBoard.find_by(id: params[:id])
        render json: { id: scoreboard.id, name: scoreboard.name, count: scoreboard.count }
    end

    def create
        new_scoreboard = ScoreBoard.create(count: params[:count], name: params[:name])
        render json: new_scoreboard
        # (User.find_by(name: params[:user_name])
    end 

end
