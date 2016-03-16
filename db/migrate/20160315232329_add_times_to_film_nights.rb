class AddTimesToFilmNights < ActiveRecord::Migration
  def change
    add_column :film_nights, :roll_call_start, :datetime
    add_column :film_nights, :roll_call_end, :datetime
    add_column :film_nights, :voting_start, :datetime
    add_column :film_nights, :voting_end, :datetime
    add_column :film_nights, :results_start, :datetime
    add_column :film_nights, :results_end, :datetime
  end
end
