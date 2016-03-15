class Film < ActiveRecord::Base
  has_many :proposals
  has_many :selections
end
