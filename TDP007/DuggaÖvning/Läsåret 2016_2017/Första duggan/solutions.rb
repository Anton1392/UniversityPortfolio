# -*- coding: utf-8 -*-

# ----------------------------------------------------------------------------
#  Uppgift 1
# ----------------------------------------------------------------------------

# Inga lösningsförslag på teorifrågor

# ----------------------------------------------------------------------------
#  Uppgift 2
# ----------------------------------------------------------------------------

# Varje gång metoden korvgryta anropas räknas värdet på @a upp med 1.
# Det sparade blocket anropas och resultet av detta, som förhoppningsvis
# är ett tal, läggs till @b. Slutligen returneras @b/@a, som först 
# multipliceras med 1.0 för att resultatet garanterat ska vara ett flyttal.
# Klassen räknar alltså ut genomsnittet för alla anrop till det givna blocket.
# Ett förslag på lämpliga namn återfinns nedan:

class AverageValue

  def initialize(&block)
    @count = 0
    @sum = 0
    @block = block
  end

  def run(i=0)
    @count += 1
    @sum += @block.call(i)
    1.0*@sum/@count
  end

end

# ----------------------------------------------------------------------------
#  Uppgift 3
# ----------------------------------------------------------------------------

def print_results(file="w_high_jump_2015.txt")
  # Read the file and construct a table
  lines = IO.readlines(file)
  headers = lines[2].split
  heights = headers[3..-1]
  table = lines[3..-1].map do | line |
    athlete = {}
    line =~ /\d+\s+(.*?)\s{2,}([A-Z]{3})\s+/
    athlete['name'] = $1
    athlete['country'] = $2
    athlete['series'] = $'.split
    athlete
  end
  # Calculate result of each athlete
  table.each do | athlete |
    series = athlete['series']
    i = series.length-1
    i -= 1 while (not series[i].index('O')) && i > 0 
    result = heights[i]
    f1 = series[i].scan('X').length
    f2 = series.join.scan('X').length
    athlete['result'] = result
    athlete['f1'] = f1  # Factor 1: Failures at top level
    athlete['f2'] = f2  # Factor 2: Failures at all levels
  end
  # Sort the table
  # (N.B. Heights and factors should be sorted in different orders,
  # hence the little reversal trick here.)
  table.sort_by! { |a| a['result']+(67-a['f1']).chr+(90-a['f2']).chr }
  # Print the table
  table.reverse_each do | athlete |
    printf("%-30s%s  %s\n", athlete['name'], athlete['country'], athlete['result'])
  end
  :ok
end

# ----------------------------------------------------------------------------
#  Uppgift 4
# ----------------------------------------------------------------------------

require 'rexml/document'

# (a) Statistik

def print_stat(file, course_code, part_code, date)
  doc = REXML::Document.new(File.open(file))
  course = doc.elements["//Course[@cid='#{course_code}']"]
  course_name = course.text.strip
  part = course.elements["./Part[@pid='#{part_code}']"]
  exam = part.elements["./Examination[@date='#{date}']"]
  stat = {}
  count = 0
  exam.elements.each("./Result") do | result |
    grade = result.attribute("grade").value
    if stat[grade]
      stat[grade] += 1
    else
      stat[grade] = 1
    end
    count += 1
  end
  puts "Betygsstatistik för #{course_code} #{course_name}"
  stat.each do | key, value |
    puts "#{key}: #{value} (#{(100.0*value/count).round}%)"
  end
end

#print_stat("records.xml","TJKS23", "TEN1", "2016-03-19")

# (b) Studieutdrag, enklare variant

def print_records_simple(file, id)
  doc = REXML::Document.new(File.open(file))
  s = doc.elements["//Student[@login='#{id}']"]
  pnr = s.attribute("sid").value
  puts s.text
  doc.elements.each("//Result[@sid='#{pnr}']") do | result |
    grade = result.attribute("grade").value
    passed = result.attribute("passed").value
    date = result.parent.attribute("date").value
    part = result.parent.parent.attribute("pid").value
    code = result.parent.parent.parent.attribute("cid").value
    name = result.parent.parent.parent.text.strip
    puts "#{code} #{name}"
    puts "  #{part} #{date} #{grade}"
  end
end

#print_records_simple("records.xml", "johka612")

# (b) Studieutdrag, lite svårare variant

def print_records(file, id)
  doc = REXML::Document.new(File.open(file))
  s = doc.elements["//Student[@login='#{id}']"]
  pnr = s.attribute("sid").value
  puts s.text
  doc.elements.each("//Course") do | course |
    course_code = course.attribute("cid").value
    course_name = course.text.strip
    course_results = []
    course.elements.each("./Part") do | part |
      part_code = part.attribute("pid").value
      part_results = []
      part.elements.each("./Examination") do | exam |
        exam_date = exam.attribute("date").value
        exam.elements.each("./Result[@sid='#{pnr}']") do | res |
          grade = res.attribute("grade").value
          part_results << [exam_date, grade]
        end
      end
      if part_results.length > 0
        course_results << [part_code] + part_results[-1]
      end
    end
    if course_results.length > 0
      puts "#{course_code} #{course_name}"
      course_results.each do | p |
        puts "  #{p[0]} #{p[2]} (#{p[1]})"
      end
    end
  end
end

#print_records("records.xml", "johka612")

