require 'date'

def slug(title)
  lowercase = title.downcase
  lowercase.strip!
  lowercase.gsub!(/\s/, '-')
end

def create_file(filename, contents)
  date = Date.today.strftime("%Y-%m-%d")
  file = '_posts/' + date + '-' + filename + '.md'
  puts 'Creating file ' + file
  out_file = File.new(file, 'w')
  out_file.puts(contents)
  out_file.close
end

puts "What is the title of the post?"
title = gets.strip!
puts "What are the keywords?"
keywords = gets.strip!

file_contents = %Q(---
layout: post
title: #{title}
date: #{Date.today.strftime('%Y-%m-%d')}
description: TBA
keywords: #{keywords}
---)

filename = slug(title)
create_file(filename, file_contents)
