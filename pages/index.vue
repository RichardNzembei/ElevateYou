<template>
      <div class="bg-white max-w-full mx-auto   ">
            <div class="flex flex-col md:flex-row gap-6">
                <!-- Sidebar -->
                <div class="w-full md:w-80 border-r-2 border-gray-200  h-screen bg-sky-950">
                    <div class="flex flex-col items-center">
                   <p class="text-2xl font-san text-white">ElevateYou</p>
                   <p class="text-md font-mono">
                    <span class="text-green-700">Track.</span>
                    <span class="text-yellow-700">Grow.</span> 
                    <span class="text-orange-700">Repeat.</span>
                </p>
                    </div>
                    <div class="mt-6">
                        <div class="flex flex-col space-y-2 mt-4">
                            <UButton label="Dashbord" icon="i-lucide-circle"
                                 color="blue"
                                class="font-medium justify-start" aria-label="Issues" />
                            <UButton  label="Developer" icon="i-lucide-bell"
                                 color="blue"
                                class="font-medium justify-start" aria-label="Requests" />
                            <UButton label="Screen Time" icon="i-lucide-thumbs-up"
                                color="blue"
                                class="font-medium justify-start" aria-label="Endorsements" />
                            <UButton label="Exercise" icon="i-lucide-message-square"
                                 color="blue"
                                class="font-medium justify-start" aria-label="Discussions" />
                            <UButton  label="Finances" icon="i-lucide-users"
                                 color="blue"
                                class="font-medium justify-start" aria-label="Employees" />
                           
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="flex-1 p-6">
                    <!-- Issues View -->
                   
                </div>
            </div>
        </div>
</template>