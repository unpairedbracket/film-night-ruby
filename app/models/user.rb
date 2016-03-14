class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :omniauthable, :omniauth_providers => [:google_oauth2]
  
  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.where(:email => data["email"]).first

    #Uncomment the section below if you want users to be created if they don't exist
    unless user
        user = User.create(name: data["name"],
           email: data["email"],
           image: data["image"],
           password: Devise.friendly_token[0,20],
           provider: access_token.provider,
           uid: access_token.uid
        )
    end
    user
  end
end
