class Selection < ActiveRecord::Base
  belongs_to :film_night
  belongs_to :film
  has_many :votes
end
