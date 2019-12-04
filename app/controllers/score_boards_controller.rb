class ScoreBoardsController < ApplicationController

    def index
        @scoreboards = ScoreBoad.all
    end 
    
end
