require 'date'

class BlogPost
  def initialize(title, keywords)
    @title = title.strip!
    @keywords = keywords.strip!
  end

  def save()
    filename = BlogPost.slug(@title)
    date = Date.today.strftime("%Y-%m-%d")
    file = '_posts/' + date + '-' + filename + '.md'
    puts 'Creating file ' + file
    out_file = File.new(file, 'w')
    out_file.puts(get_file_contents)
    out_file.close
  end

  # class method
  def self.slug(title)
    lowercase = title.downcase
    lowercase.strip!
    lowercase.gsub!(/\s/, '-')
  end

  # Anything below this is private
  private

  def get_file_contents()
    [
      '---',
      'layout: post',
      "title: #{@title}",
      "date: #{Date.today.strftime('%Y-%m-%d')}",
      'description: TBA',
      'image: ',
      'image_alt: ',
      "keywords: #{@keywords}",
      '---'
    ].join("\n")
  end
end

puts "What is the title of the post?"
title = gets
puts "What are the keywords?"
keywords = gets
blog_post = BlogPost.new(title, keywords)
blog_post.save
