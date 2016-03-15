class FilmNight < ActiveRecord::Base
  has_many :selections
  
  def self.getCurrent(tolerance)
    FilmNight.where("created_at < datetime('now', '+? minute')", tolerance).order(created_at: :desc).take
  end
end
