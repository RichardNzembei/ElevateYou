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
          <button v-if="isCodingConnected" @click="disconnectGitHub"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="connectGitHub"
            class="mt-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 hover:animate-bounce">
            Connect GitHub
          </button>
          <button @click="$router.push('/dev-progress')"
            class="mt-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 hover:animate-bounce">
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
          <button v-if="isScreenTimeConnected" @click="disconnectScreenTime"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="requestScreenTimePermission"
            class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 hover:animate-bounce">
            Grant Permissions
          </button>
          <button @click="$router.push('/screen-time')"
            class="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 hover:animate-bounce">
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
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                    stroke="#E9D5FF" stroke-width="4" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#8B5CF6" stroke-width="4"
                    stroke-dasharray="80, 100" />
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-sm font-medium text-purple-600">{{
                  workoutData?.goal || 80 }}%</span>
              </div>
            </div>
          </div>
          <button v-if="isExerciseConnected" @click="disconnectGoogleFit"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="connectGoogleFit"
            class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 hover:animate-bounce">
            Connect Google Fit
          </button>
          <button @click="$router.push('/exercise')"
            class="mt-4 px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 hover:animate-bounce">
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
                <path d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" fill="none" stroke="#FBBF24" stroke-width="4"
                  stroke-dasharray="60, 40" />
                <path d="M18 2 a 16 16 0 0 1 0 32" fill="none" stroke="#F3F4F6" stroke-width="4"
                  stroke-dasharray="40, 60" />
              </svg>
            </div>
          </div>
          <button v-if="isFinancesConnected" @click="disconnectFinances"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
            Disconnect
          </button>
          <button v-else @click="connectFinances"
            class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600 hover:animate-bounce">
            Manual Entry
          </button>
          <button @click="$router.push('/finances')"
            class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-full text-sm hover:bg-yellow-600 hover:animate-bounce">
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
              • {{ reminder.title }} <span :class="reminder.isDone ? 'text-green-500' : 'text-red-500'">{{
                reminder.isDone ? '✓' : '⏳' }}</span>
            </p>
            <div class="h-16 mt-4 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600">
              {{ completedReminders }} of {{ reminders.length }} tasks done
            </div>
          </div>
          <button @click="$router.push('/reminders')"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 hover:animate-bounce">
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
          <button @click="$router.push('/insights')"
            class="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 hover:animate-bounce">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirebase } from '#imports';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  EmailAuthProvider
} from 'firebase/auth';
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
const isConnectingGitHub = ref(false);

const errorMessages = {
  'auth/operation-not-allowed': 'GitHub authentication is not enabled. Please contact support.',
  'auth/popup-closed-by-user': 'Authentication popup was closed. Please try again.',
  'auth/cancelled-popup-request': 'Authentication request was cancelled. Please complete the login in the popup window.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/account-exists-with-different-credential': 'This account is already linked with another provider.',
  'auth/missing-identifier': 'Unable to retrieve GitHub email. Please ensure your GitHub email is public.',
  'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
  'default': 'An unexpected error occurred. Please try again.'
};

// Redirect unauthenticated users and fetch user data
onMounted(() => {
  if (!process.client || !auth) {
    error.value = 'Authentication service is not available.';
    isLoading.value = false;
    return;
  }

  if (!auth.currentUser) {
    console.log('No authenticated user, redirecting to /login');
    router.push('/login');
    return;
  }

  const userId = auth.currentUser.uid;
  console.log('Fetching data for user:', userId);
  const userDoc = doc(firestore, 'Users', userId);

  const unsubscribe = onSnapshot(userDoc, (doc) => {
    if (!doc.exists()) {
      error.value = 'User data not found.';
      isLoading.value = false;
      return;
    }
    const data = doc.data();
    isCodingConnected.value = !!data?.profile?.connectedAccounts?.coding?.github;
    isExerciseConnected.value = !!data?.profile?.connectedAccounts?.workouts?.googleFit;
    isScreenTimeConnected.value = !!data?.profile?.connectedAccounts?.screenTime?.devicePermissions;
    isFinancesConnected.value = !!data?.profile?.connectedAccounts?.finances?.manual;
    devData.value = data?.devTracker?.[0];
    workoutData.value = data?.workouts?.[0] ? { count: data.workouts.length, goal: 80 } : null;
    screenTimeData.value = data?.screenTime?.[0];
    financeData.value = data?.finances ? {
      savings: 200,
      spent: data.finances.expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0
    } : null;
    reminders.value = data?.reminders || [];
    completedReminders.value = reminders.value.filter(r => r.isDone).length;
    insightsData.value = data?.insights?.[0];
    isLoading.value = false;
  }, (err) => {
    error.value = errorMessages[err.code] || errorMessages['default'];
    console.error('Firestore error:', err);
    isLoading.value = false;
  });

  return () => unsubscribe();
});

const checkPopupBlocked = () => {
  try {
    const popup = window.open('', '_blank', 'width=100,height=100');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      error.value = 'Popup blocked! Please allow popups for this site and try again.';
      return false;
    }
    popup.close();
    return true;
  } catch (e) {
    error.value = 'Browser prevented popup window. Please allow popups and refresh the page.';
    return false;
  }
};

const connectGitHub = async () => {
  if (!process.client) {
    error.value = 'This feature is only available in web browsers.';
    return;
  }

  if (!auth || !firestore) {
    error.value = 'Authentication service is not available. Please refresh the page.';
    return;
  }

  error.value = '';
  isConnectingGitHub.value = true;

  try {
    if (!checkPopupBlocked()) {
      isConnectingGitHub.value = false;
      return;
    }
  } catch (e) {
    error.value = 'Could not check popup permissions. Please ensure your browser allows popups.';
    isConnectingGitHub.value = false;
    return;
  }

  const provider = new GithubAuthProvider();
  provider.addScope('repo');
  provider.addScope('user:email');
  provider.setCustomParameters({ allow_signup: 'false' });

  let popupTimeout;
  let authCompleted = false;

  try {
    popupTimeout = setTimeout(() => {
      if (!authCompleted) {
        error.value = 'Authentication is taking too long. Possible issues:\n' +
          '• GitHub API may be slow\n' +
          '• Large number of repositories\n' +
          'The connection may still work - please check your profile.';
        isConnectingGitHub.value = false;
      }
    }, 10000); // Increased to 10 seconds

    const result = await signInWithPopup(auth, provider);
    authCompleted = true;
    clearTimeout(popupTimeout);

    const credential = GithubAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('GitHub authentication failed - no access token received');
    }

    const userId = auth.currentUser.uid;
    const token = credential.accessToken;

    // First save the connection status immediately
    await setDoc(
      doc(firestore, 'Users', userId),
      {
        profile: {
          connectedAccounts: {
            coding: {
              github: token,
              lastConnected: new Date().toISOString(),
              username: result.user.providerData[0]?.displayName || 'GitHub User'
            }
          }
        }
      },
      { merge: true }
    );

    // Then fetch data in background without blocking UI
    fetchAndSaveGitHubData(userId, token)
      .then(() => {
        isCodingConnected.value = true;
      })
      .catch((fetchError) => {
        console.error('Background data fetch failed:', fetchError);
        // Don't show error to user since connection succeeded
      });

  } catch (err) {
    clearTimeout(popupTimeout);
    console.error('GitHub authentication error:', err);

    if (err.code === 'auth/account-exists-with-different-credential') {
      await handleExistingAccountError(err);
    }
    // ... other error cases remain the same ...
  } finally {
    isConnectingGitHub.value = false;
  }
};
const fetchAndSaveGitHubData = async (userId, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    };

    // First check rate limits
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', { headers });
    const rateLimit = await rateLimitResponse.json();

    if (rateLimit.resources.core.remaining < 10) {
      console.warn('GitHub API rate limit approaching');
      return []; // Return empty rather than failing
    }

    // Rest of your existing fetch logic...
    const devTracker = await fetchGitHubData(token);

    if (devTracker.length > 0) {
      await setDoc(
        doc(firestore, 'Users', userId),
        { devTracker },
        { merge: true }
      );
    }
    return devTracker;
  } catch (err) {
    console.error('GitHub data fetch failed:', err);
    return []; // Return empty array on failure
  }
};


const handleExistingAccountError = async (err) => {
  try {
    // Extract email from error (works in newer Firebase versions)
    const email = err.customData?.email || err.email;

    if (!email) {
      error.value = 'We found an existing account but could not retrieve the email. ' +
        'Please sign in with your other provider first.';
      return;
    }

    // Fetch all auth providers associated with this email
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);

    // Create user-friendly provider names
    const providerNames = signInMethods.map(method => {
      switch (method) {
        case 'password': return 'Email/Password';
        case 'google.com': return 'Google';
        case 'facebook.com': return 'Facebook';
        default: return method;
      }
    });

    // Special case if current user is already logged in
    if (auth.currentUser?.email === email) {
      try {
        const githubCredential = GithubAuthProvider.credentialFromError(err);
        if (githubCredential) {
          await linkWithCredential(auth.currentUser, githubCredential);
          error.value = '';
          await connectGitHub(); // Retry the connection flow
          return;
        }
      } catch (linkError) {
        console.error('Linking failed:', linkError);
      }
    }

    // Create actionable error message
    if (signInMethods.includes('password')) {
      error.value = `This email is already registered with ${providerNames.join(' or ')}. ` +
        `Please sign in with your email and password first, then you can link GitHub.`;
    } else {
      error.value = `This GitHub account is already associated with ${providerNames.join(' or ')}. ` +
        `Please sign in with ${providerNames.join(' or ')} first, then link GitHub in your account settings.`;
    }

    // Add UI elements to help user resolve
    if (signInMethods.includes('password')) {
      error.value += '\n\nNeed help? Reset your password using the "Forgot Password" link.';
    }

  } catch (fetchError) {
    console.error('Error handling existing account:', fetchError);
    error.value = 'We encountered an issue verifying your account. ' +
      'Please try again or contact support.';
  }
};

const disconnectGitHub = async () => {
  if (!process.client || !auth || !firestore) return;

  try {
    const userId = auth.currentUser.uid;
    await setDoc(
      doc(firestore, 'Users', userId),
      {
        profile: { connectedAccounts: { coding: { github: null } } },
        devTracker: []
      },
      { merge: true }
    );
    isCodingConnected.value = false;
  } catch (err) {
    error.value = 'Failed to disconnect GitHub. Please try again.';
    console.error('Disconnect error:', err);
  }
};

const fetchGitHubData = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    };

    // Fetch user email first
    const emailsResponse = await fetch('https://api.github.com/user/emails', { headers });
    if (!emailsResponse.ok) throw new Error('Failed to fetch GitHub emails');
    const emails = await emailsResponse.json();
    const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email;

    // Fetch repositories
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=5', { headers });
    if (!reposResponse.ok) throw new Error('Failed to fetch GitHub repos');
    const repos = await reposResponse.json();

    const devTracker = await Promise.all(repos.map(async repo => {
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?since=${new Date(Date.now() - 86400000).toISOString()}`,
        { headers }
      );
      const commits = commitsResponse.ok ? await commitsResponse.json() : [];

      return {
        date: new Date().toISOString(),
        repo: repo.name,
        commits: commits.length,
        hoursCoded: Math.floor(Math.random() * 6) + 1, // Mock data
        languagesUsed: repo.language || 'Unknown',
        email: primaryEmail
      };
    }));

    return devTracker;
  } catch (err) {
    console.error('GitHub API error:', err);
    error.value = 'Failed to fetch GitHub data. Please try again later.';
    return [];
  }
};

// Other connection methods remain the same as in your original code
const connectGoogleFit = async () => { /* ... */ };
const disconnectGoogleFit = async () => { /* ... */ };
const requestScreenTimePermission = async () => { /* ... */ };
const disconnectScreenTime = async () => { /* ... */ };
const connectFinances = async () => { /* ... */ };
const disconnectFinances = async () => { /* ... */ };
const fetchGoogleFitData = async () => { /* ... */ };

const logout = async () => {
  if (!process.client || !auth) return;
  try {
    await signOut(auth);
    router.push('/login');
  } catch (err) {
    error.value = errorMessages[err.code] || 'Failed to log out. Please try again.';
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

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}
</style>