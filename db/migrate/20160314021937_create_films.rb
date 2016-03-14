class CreateFilms < ActiveRecord::Migration
  def change
    create_table :films do |t|
      t.string :imdbid
      t.string :title
      t.integer :year
      t.boolean :enabled

      t.timestamps null: false
    end
  end
end
