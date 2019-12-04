Rails.application.routes.draw do
  resources :score_boards
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/' => 'application#home'
  
end