<template>
  <div class="bg-gray-100 min-h-screen p-4 sm:p-6">
    <div v-if="isLoading" class="text-center text-lg text-gray-600">Loading...</div>
    <div v-else>
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl sm:text-4xl font-quicksand font-bold text-navy-800">Your Growth Journey</h1>
        <p class="text-sm sm:text-base font-caveat text-gray-600 italic mt-2">
          “Small steps, big wins!” — Keep shining!
        </p>
        <button @click="logout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
          Log Out
        </button>
      </div>

      <!-- Error Message -->
      <p v-if="error" class="text-center text-sm text-red-500 mb-4">{{ error }}</p>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
        <!-- Developer Card -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Developer</h2>
            <Icon name="i-lucide-code" class="h-7 w-7 text-green-500" />
          </div>
          <div class="mt-4">
            <p v-if="isCodingConnected" class="text-sm text-gray-600">
              Coding: <span class="font-medium">{{ devData?.hoursCoded || 4 }}h today</span>
            </p>
            <p v-if="isCodingConnected" class="text-sm text-gray-600">
              Commits: <span class="font-medium">{{ devData?.commits || 5 }}</span>
            </p>
            <p v-else class="text-sm text-gray-600">Not Connected</p>
            <div v-if="isCodingConnected" class="h-16 mt-4 bg-gray-100 rounded-lg flex items-end gap-1 p-2">
              <div class="w-1/5 h-8 bg-green-300 rounded"></div>
              <div class="w-1/5 h-12 bg-green-400 rounded"></div>
              <div class="w-1/5 h-10 bg-green-500 rounded"></div>
              <div class="w-1/5 h-14 bg-green-600 rounded"></div>
              <div class="w-1/5 h-9 bg-green-700 rounded"></div>
            </div>
          </div>
          <button v-if="isCodingConnected" @click="disconnectGitHub" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="connectGitHub" class="mt-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 hover:animate-bounce">
            Connect GitHub
          </button>
          <button @click="$router.push('/dev-progress')" class="mt-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 hover:animate-bounce">
            View Details
          </button>
        </div>

        <!-- Screen Time Card -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Screen Time</h2>
            <Icon name="i-lucide-smartphone" class="h-7 w-7 text-orange-500" />
          </div>
          <div class="mt-4">
            <p v-if="isScreenTimeConnected" class="text-sm text-gray-600">
              Total: <span class="font-medium">{{ screenTimeData?.totalScreenTime || 3 }}h today</span>
            </p>
            <p v-if="isScreenTimeConnected" class="text-sm text-gray-600">
              Top App: <span class="font-medium">{{ screenTimeData?.appUsage || 'YouTube' }}</span>
            </p>
            <p v-else class="text-sm text-gray-600">Not Connected</p>
            <div v-if="isScreenTimeConnected" class="h-16 mt-4 bg-gray-100 rounded-lg flex items-end gap-1 p-2">
              <div class="w-1/3 h-12 bg-orange-300 rounded"></div>
              <div class="w-1/3 h-8 bg-orange-400 rounded"></div>
              <div class="w-1/3 h-4 bg-orange-500 rounded"></div>
            </div>
          </div>
          <button v-if="isScreenTimeConnected" @click="disconnectScreenTime" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="requestScreenTimePermission" class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 hover:animate-bounce">
            Grant Permissions
          </button>
          <button @click="$router.push('/screen-time')" class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 hover:animate-bounce">
            View Details
          </button>
        </div>

        <!-- Exercise Card -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Exercise</h2>
            <Icon name="i-lucide-dumbbell" class="h-7 w-7 text-purple-500" />
          </div>
          <div class="mt-4">
            <p v-if="isExerciseConnected" class="text-sm text-gray-600">
              Workouts: <span class="font-medium">{{ workoutData?.count || 2 }} this week</span>
            </p>
            <p v-if="isExerciseConnected" class="text-sm text-gray-600">
              Goal: <span class="font-medium">{{ workoutData?.goal || 80 }}%</span>
            </p>
            <p v-else class="text-sm text-gray-600">Not Connected</p>
            <div v-if="isExerciseConnected" class="h-16 mt-4 flex justify-center">
              <div class="relative h-16 w-16">
                <svg class="h-full w-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E9D5FF" stroke-width="4"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#8B5CF6" stroke-width="4" stroke-dasharray="80, 100"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-medium text-purple-600">{{ workoutData?.goal || 80 }}%</span>
              </div>
            </div>
          </div>
          <button v-if="isExerciseConnected" @click="disconnectGoogleFit" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="connectGoogleFit" class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 hover:animate-bounce">
            Connect Google Fit
          </button>
          <button @click="$router.push('/exercise')" class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 hover:animate-bounce">
            View Details
          </button>
        </div>

        <!-- Finances Card -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Finances</h2>
            <Icon name="i-lucide-dollar-sign" class="h-7 w-7 text-yellow-500" />
          </div>
          <div class="mt-4">
            <p v-if="isFinancesConnected" class="text-sm text-gray-600">
              Savings: <span class="font-medium">${{ financeData?.savings || 200 }}</span>
            </p>
            <p v-if="isFinancesConnected" class="text-sm text-gray-600">
              Spent: <span class="font-medium">${{ financeData?.spent || 50 }}</span>
            </p>
            <p v-else class="text-sm text-gray-600">Not Connected</p>
            <div v-if="isFinancesConnected" class="h-16 mt-4 flex justify-center">
              <svg class="h-16 w-16" viewBox="0 0 36 36">
                <path d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" stroke="#FBBF24" stroke-width="4" stroke-dasharray="60, 40"/>
                <path d="M18 2 a 16 16 0 0 1 0 32" fill="none" stroke="#F3F4F6" stroke-width="4" stroke-dasharray="40, 60"/>
              </svg>
            </div>
          </div>
          <button v-if="isFinancesConnected" @click="disconnectFinances" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="connectFinances" class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600 hover:animate-bounce">
            Manual Entry
          </button>
          <button @click="$router.push('/finances')" class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600 hover:animate-bounce">
            View Details
          </button>
        </div>

        <!-- Reminders Card -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Reminders</h2>
            <Icon name="i-lucide-bell" class="h-7 w-7 text-blue-500" />
          </div>
          <div class="mt-4">
            <p v-for="reminder in reminders.slice(0, 2)" :key="reminder.title" class="text-sm text-gray-600">
              • {{ reminder.title }} <span :class="reminder.isDone ? 'text-green-500' : 'text-red-500'">{{ reminder.isDone ? '✓' : '⏳' }}</span>
            </p>
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
              {{ completedReminders }} of {{ reminders.length }} tasks done
            </div>
          </div>
          <button @click="$router.push('/reminders')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 hover:animate-bounce">
            View Details
          </button>
        </div>

        <!-- Growth Insights Card -->
        <div class="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-navy-800">Growth Insights</h2>
            <Icon name="i-lucide-trending-up" class="h-7 w-7 text-pink-500" />
          </div>
          <div class="mt-4">
            <p class="text-sm text-gray-600">
              Trend: <span class="font-medium">{{ insightsData?.trend || '+10% coding' }}</span>
            </p>
            <p class="text-sm text-gray-600">
              Tip: <span class="font-medium">{{ insightsData?.tip || 'Keep it up!' }}</span>
            </p>
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-end gap-1 p-2">
              <div class="w-1/5 h-6 bg-pink-300 rounded"></div>
              <div class="w-1/5 h-8 bg-pink-400 rounded"></div>
              <div class="w-1/5 h-10 bg-pink-500 rounded"></div>
              <div class="w-1/5 h-12 bg-pink-600 rounded"></div>
              <div class="w-1/5 h-14 bg-pink-700 rounded"></div>
            </div>
          </div>
          <button @click="$router.push('/insights')" class="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 hover:animate-bounce">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirebase } from '@/firebase-client';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const { auth, firestore } = useFirebase();
const router = useRouter();

// State for connection status and data
const isCodingConnected = ref(false);
const isExerciseConnected = ref(false);
const isScreenTimeConnected = ref(false);
const isFinancesConnected = ref(false);
const devData = ref(null);
const workoutData = ref(null);
const screenTimeData = ref(null);
const financeData = ref(null);
const reminders = ref([]);
const insightsData = ref(null);
const completedReminders = ref(0);
const isLoading = ref(true);
const error = ref('');

// Redirect unauthenticated users
onMounted(() => {
  if (!process.client || !auth) {
    error.value = 'Authentication service is not available.';
    isLoading.value = false;
    return;
  }

  if (!auth.currentUser) {
    router.push('/login');
    return;
  }

  const userId = auth.currentUser.uid;
  const userDoc = doc(firestore, 'Users', userId);
  onSnapshot(userDoc, (doc) => {
    const data = doc.data();
    isCodingConnected.value = !!data?.profile?.connectedAccounts?.coding?.github;
    isExerciseConnected.value = !!data?.profile?.connectedAccounts?.workouts?.googleFit;
    isScreenTimeConnected.value = !!data?.profile?.connectedAccounts?.screenTime?.devicePermissions;
    isFinancesConnected.value = !!data?.profile?.connectedAccounts?.finances?.manual;
    devData.value = data?.devTracker?.[0];
    workoutData.value = data?.workouts?.[0] ? { count: data.workouts.length, goal: 80 } : null;
    screenTimeData.value = data?.screenTime?.[0];
    financeData.value = data?.finances ? { savings: 200, spent: data.finances.expenses.reduce((sum, exp) => sum + exp.amount, 0) } : null;
    reminders.value = data?.reminders || [];
    completedReminders.value = reminders.value.filter(r => r.isDone).length;
    insightsData.value = data?.insights?.[0];
    isLoading.value = false;
  }, (err) => {
    error.value = 'Failed to load user data.';
    console.error('Firestore error:', err);
    isLoading.value = false;
  });
});

const connectGitHub = async () => {
  if (!process.client || !auth || !firestore) {
    error.value = 'Authentication service is not available.';
    return;
  }
  const provider = new GithubAuthProvider();
  provider.addScope('repo user');
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const userId = auth.currentUser.uid;
    await setDoc(doc(firestore, 'Users', userId), {
      profile: { connectedAccounts: { coding: { github: token } } },
    }, { merge: true });
    const devTracker = await fetchGitHubData(token);
    await setDoc(doc(firestore, 'Users', userId), { devTracker }, { merge: true });
  } catch (err) {
    error.value = 'Failed to connect GitHub. Please try again.';
    console.error('GitHub connection error:', err);
  }
};

const disconnectGitHub = async () => {
  if (!process.client || !auth || !firestore) return;
  const userId = auth.currentUser.uid;
  await setDoc(doc(firestore, 'Users', userId), {
    profile: { connectedAccounts: { coding: { github: null } } },
    devTracker: [],
  }, { merge: true });
};

const connectGoogleFit = async () => {
  if (!process.client || !auth || !firestore) {
    error.value = 'Authentication service is not available.';
    return;
  }
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/fitness.activity.read');
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const userId = auth.currentUser.uid;
    await setDoc(doc(firestore, 'Users', userId), {
      profile: { connectedAccounts: { workouts: { googleFit: token } } },
    }, { merge: true });
    const workouts = await fetchGoogleFitData(token);
    await setDoc(doc(firestore, 'Users', userId), { workouts }, { merge: true });
  } catch (err) {
    error.value = 'Failed to connect Google Fit. Please try again.';
    console.error('Google Fit connection error:', err);
  }
};

const disconnectGoogleFit = async () => {
  if (!process.client || !auth || !firestore) return;
  const userId = auth.currentUser.uid;
  await setDoc(doc(firestore, 'Users', userId), {
    profile: { connectedAccounts: { workouts: { googleFit: null } } },
    workouts: [],
  }, { merge: true });
};

const requestScreenTimePermission = async () => {
  if (!process.client || !auth || !firestore) return;
  const userId = auth.currentUser.uid;
  await setDoc(doc(firestore, 'Users', userId), {
    profile: { connectedAccounts: { screenTime: { devicePermissions: true } } },
  }, { merge: true });
  const screenTime = [{ date: new Date().toISOString(), appUsage: 'YouTube', totalScreenTime: 3, unlocks: 10 }];
  await setDoc(doc(firestore, 'Users', userId), { screenTime }, { merge: true });
};

const disconnectScreenTime = async () => {
  if (!process.client || !auth || !firestore) return;
  const userId = auth.currentUser.uid;
  await setDoc(doc(firestore, 'Users', userId), {
    profile: { connectedAccounts: { screenTime: { devicePermissions: false } } },
    screenTime: [],
  }, { merge: true });
};

const connectFinances = async () => {
  if (!process.client || !auth || !firestore) return;
  const userId = auth.currentUser.uid;
  await setDoc(doc(firestore, 'Users', userId), {
    profile: { connectedAccounts: { finances: { manual: true } } },
    finances: { expenses: [], income: [] },
  }, { merge: true });
};

const disconnectFinances = async () => {
  if (!process.client || !auth || !firestore) return;
  const userId = auth.currentUser.uid;
  await setDoc(doc(firestore, 'Users', userId), {
    profile: { connectedAccounts: { finances: { manual: false } } },
    finances: { expenses: [], income: [] },
  }, { merge: true });
};

const fetchGitHubData = async (token) => {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const reposResponse = await fetch('https://api.github.com/user/repos', { headers });
    if (!reposResponse.ok) throw new Error('Failed to fetch GitHub repos');
    const repos = await reposResponse.json();
    const devTracker = [];
    for (const repo of repos.slice(0, 1)) {
      const commitsResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/commits`, { headers });
      if (!commitsResponse.ok) throw new Error('Failed to fetch GitHub commits');
      const commits = await commitsResponse.json();
      devTracker.push({
        date: new Date().toISOString(),
        repo: repo.name,
        commits: commits.length,
        hoursCoded: 4,
        languagesUsed: repo.language,
      });
    }
    return devTracker;
  } catch (err) {
    error.value = 'Failed to fetch GitHub data.';
    console.error('fetchGitHubData error:', err);
    throw err;
  }
};

const fetchGoogleFitData = async (token) => {
  return [{ date: new Date().toISOString(), type: 'Workout', duration: 30, calories: 200 }];
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (err) {
    error.value = 'Failed to log out. Please try again.';
    console.error('Logout error:', err);
  }
};
</script>

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