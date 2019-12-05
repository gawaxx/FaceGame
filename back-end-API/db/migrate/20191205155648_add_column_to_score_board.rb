class AddColumnToScoreBoard < ActiveRecord::Migration[6.0]
  def change
    add_column :score_boards, :name, :string
  end
end
