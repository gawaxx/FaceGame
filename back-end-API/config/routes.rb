Rails.application.routes.draw do
  resources :users
  resources :score_boards
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/' => 'application#home'
  # get 'score_boards/create', to: 'score_boards#create'

  
end