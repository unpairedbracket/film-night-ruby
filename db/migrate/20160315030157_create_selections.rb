class CreateSelections < ActiveRecord::Migration
  def change
    create_table :selections do |t|
      t.references :film
      t.references :film_night, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
