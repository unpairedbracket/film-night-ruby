class CreateFilmNights < ActiveRecord::Migration
  def change
    create_table :film_nights do |t|

      t.timestamps null: false
    end
  end
end
