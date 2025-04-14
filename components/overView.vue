<template>
    <div class="bg-gray-100 min-h-screen p-4 sm:p-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl sm:text-4xl font-quicksand font-bold text-navy-800">Your Growth Journey</h1>
        <p class="text-sm sm:text-base font-caveat text-gray-600 italic mt-2">
          “Small steps, big wins!” — Keep shining!
        </p>
      </div>
  
      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        <!-- Developer -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Developer</h2>
            <Icon name="i-lucide-code" class="h-7 w-7 text-green-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">Coding: <span class="font-medium">4h today</span></p>
            <p class="text-sm text-gray-600">Commits: <span class="font-medium">5</span></p>
            <!-- Mini Chart (Placeholder) -->
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-end gap-1 p-2">
              <div class="w-1/5 h-8 bg-green-300 rounded"></div>
              <div class="w-1/5 h-12 bg-green-400 rounded"></div>
              <div class="w-1/5 h-10 bg-green-500 rounded"></div>
              <div class="w-1/5 h-14 bg-green-600 rounded"></div>
              <div class="w-1/5 h-9 bg-green-700 rounded"></div>
            </div>
          </div>
          <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 hover:animate-bounce">
            View Details
          </button>
        </div>
  
        <!-- Screen Time -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Screen Time</h2>
            <Icon name="i-lucide-smartphone" class="h-7 w-7 text-orange-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">Total: <span class="font-medium">3h today</span></p>
            <p class="text-sm text-gray-600">Top App: <span class="font-medium">YouTube</span></p>
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-end gap-1 p-2">
              <div class="w-1/3 h-12 bg-orange-300 rounded"></div>
              <div class="w-1/3 h-8 bg-orange-400 rounded"></div>
              <div class="w-1/3 h-4 bg-orange-500 rounded"></div>
            </div>
          </div>
          <button class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 hover:animate-bounce">
            View Details
          </button>
        </div>
  
        <!-- Exercise -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Exercise</h2>
            <Icon name="i-lucide-dumbbell" class="h-7 w-7 text-purple-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">Workouts: <span class="font-medium">2 this week</span></p>
            <p class="text-sm text-gray-600">Goal: <span class="font-medium">80%</span></p>
            <div class="h-16 mt-4 flex justify-center">
              <div class="relative h-16 w-16">
                <svg class="h-full w-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E9D5FF" stroke-width="4"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#8B5CF6" stroke-width="4" stroke-dasharray="80, 100"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-medium text-purple-600">80%</span>
              </div>
            </div>
          </div>
          <button class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 hover:animate-bounce">
            View Details
          </button>
        </div>
  
        <!-- Finances -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Finances</h2>
            <Icon name="i-lucide-dollar-sign" class="h-7 w-7 text-yellow-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">Savings: <span class="font-medium">$200</span></p>
            <p class="text-sm text-gray-600">Spent: <span class="font-medium">$50</span></p>
            <div class="h-16 mt-4 flex justify-center">
              <svg class="h-16 w-16" viewBox="0 0 36 36">
                <path d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" stroke="#FBBF24" stroke-width="4" stroke-dasharray="60, 40"/>
                <path d="M18 2 a 16 16 0 0 1 0 32" fill="none" stroke="#F3F4F6" stroke-width="4" stroke-dasharray="40, 60"/>
              </svg>
            </div>
          </div>
          <button class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600 hover:animate-bounce">
            View Details
          </button>
        </div>
  
        <!-- Reminders -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Reminders</h2>
            <Icon name="i-lucide-bell" class="h-7 w-7 text-blue-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">• Code 1h <span class="text-green-500">✓</span></p>
            <p class="text-sm text-gray-600">• Run 30min <span class="text-red-500">⏳</span></p>
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
              1 of 2 tasks done
            </div>
          </div>
          <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 hover:animate-bounce">
            View Details
          </button>
        </div>
  
        <!-- Growth Insights -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Growth Insights</h2>
            <Icon name="i-lucide-trending-up" class="h-7 w-7 text-pink-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">Trend: <span class="font-medium">+10% coding</span></p>
            <p class="text-sm text-gray-600">Tip: <span class="font-medium">Keep it up!</span></p>
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-end gap-1 p-2">
              <div class="w-1/5 h-6 bg-pink-300 rounded"></div>
              <div class="w-1/5 h-8 bg-pink-400 rounded"></div>
              <div class="w-1/5 h-10 bg-pink-500 rounded"></div>
              <div class="w-1/5 h-12 bg-pink-600 rounded"></div>
              <div class="w-1/5 h-14 bg-pink-700 rounded"></div>
            </div>
          </div>
          <button class="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 hover:animate-bounce">
            View Details
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .font-quicksand {
    font-family: 'Quicksand', sans-serif;
  }
  .font-caveat {
    font-family: 'Caveat', cursive;
  }
  .animate-bounce {
    animation: bounce 0.3s ease-in-out;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  </style>