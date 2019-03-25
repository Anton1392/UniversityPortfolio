project(game)

cmake_minimum_required(VERSION 3.5)

# Använd C++ 14.
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")
# På skolans Linux -system finns två versioner av SFML. Se vilken som används:
if (DEFINED ENV{LOADEDMODULES} AND ("$ENV{LOADEDMODULES}" MATCHES ".*prog/gcc/6.1.0.*"))
set(CMAKE_CXX_COMPILER /sw/gcc-6.1.0/bin/g++)
if (DEFINED ENV{SFML_ROOT})
list(APPEND CMAKE_MODULE_PATH "$ENV{SFML_ROOT}/share/SFML/cmake/Modules")
endif()
endif()
# Välj vilka delar av SFML som ska användas.
set(SFML_MODULES network graphics window system audio)
# Försök att hitta SFML genom att anropa 'FindSFML.cmake '.
find_package(SFML 2 COMPONENTS ${SFML_MODULES})
include_directories(${SFML_INCLUDE_DIR})
# Om det inte gick hoppas vi att det är installerat i alla fall.
if (NOT (${SFML_FOUND} STREQUAL "TRUE"))
set(SFML_LIBRARIES "")
foreach(i ${SFML_MODULES})
list(APPEND SFML_LIBRARIES "sfml-${i}")
endforeach(i)
endif()





# Ange källfiler , lägg till de filer som ni behöver!
set(SOURCE_FILES
	main.cc
	mixin.cc
	mixin.h
	world.cc
	world.h
	player.h
	player.cc
	tools.h
	tools.cc
	enemy.h
	enemy.cc
	bullet.h
	bullet.cc
	wall.h
	wall.cc
	powerup.h
	powerup.cc
	gui.cc
	gui.h
	spawner.h
	spawner.cc
	sounds.cc
	sounds.h)





# Säg till CMake att skapa en körbar fil som heter 'game '.
add_executable(game ${SOURCE_FILES})
# Länka med biblioteken som vi hittade tidigare.
target_link_libraries(game ${SFML_LIBRARIES} ${SFML_DEPENDENCIES})
