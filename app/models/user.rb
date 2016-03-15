class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :omniauthable, :omniauth_providers => [:google_oauth2]
  
  has_many :proposals
  has_many :votes
  
  def self.from_omniauth(access_token)
    data = access_token.info

    #Uncomment the section below if you want users to be created if they don't exist
    where(provider: access_token.provider, uid: access_token.uid).first_or_create do |user|
      user.email = data.email
      user.password = Devise.friendly_token[0,20]
      user.name = data.name   # assuming the user model has a name
      user.image = data.image # assuming the user model has an image
    end
  end
end
