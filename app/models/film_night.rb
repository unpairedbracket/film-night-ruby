class FilmNight < ActiveRecord::Base
  has_many :selections
  
  def self.getCurrent(tolerance=0)
    FilmNight.where("roll_call_end < datetime('now', '+? minute')", tolerance).order(created_at: :desc)[0]
  end
  
  def self.getCurrentResults(night_id=false)
    return FilmNight.find(night_id) if(night_id)
    FilmNight.where("results_start < 'now'").order(created_at: :desc)[0]
  end
end
