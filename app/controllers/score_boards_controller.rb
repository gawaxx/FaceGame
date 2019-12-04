class ScoreBoardsController < ApplicationController

    def index
        scoreboards = ScoreBoard.all
        render json: ScoreBoard.new(scoreboards)
    end 

end
