import React, { useState, useEffect } from 'react';
import { Activity, Settings, TrendingUp, Calendar, Dumbbell, Heart, Trophy, Plus, CheckCircle, AlertCircle, Save, Download, Award, Flame, Target, BarChart3, Camera, Scale, Apple, Pill, Phone, Share2, Printer, Bell, Video, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const FitnessApp = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState({
    name: 'Mary',
    age: 65,
    experienceLevel: 'intermediate',
    healthConditions: ['Arthritis'],
    fitnessGoals: ['Improve Strength', 'Better Balance'],
    weeklyGoal: 4,
    workoutLocation: 'home',
    startDate: new Date().toISOString(),
    emergencyContacts: [],
    medications: [],
    reminderTime: '09:00',
    reminderEnabled: false
  });
  
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      type: 'Resistance Training',
      duration: 35,
      rating: 4,
      notes: 'Felt strong today! Added an extra set of chair squats.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      exercises: [{ name: 'Chair Squats', weight: 0, reps: 12, sets: 3 }]
    },
    {
      id: 2,
      type: 'Walking',
      duration: 30,
      rating: 5,
      notes: 'Beautiful morning walk in the park. Knees felt great!',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      type: 'Flexibility',
      duration: 20,
      rating: 4,
      notes: 'Good stretching session. Hamstrings are getting more flexible.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      type: 'Cardio',
      duration: 25,
      rating: 3,
      notes: 'Stationary bike - a bit tired today but pushed through.',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 5,
      type: 'Balance',
      duration: 15,
      rating: 4,
      notes: 'Single leg stands getting easier!',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 6,
      type: 'Mixed',
      duration: 40,
      rating: 5,
      notes: 'Full body workout - feeling accomplished!',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [bodyMetrics, setBodyMetrics] = useState([
    { id: 1, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), weight: 165, waist: 34, notes: 'Starting point' },
    { id: 2, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), weight: 164, waist: 33.5, notes: 'Feeling good' }
  ]);

  const [progressPhotos, setProgressPhotos] = useState([]);
  const [painLog, setPainLog] = useState([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [selectedExerciseVideo, setSelectedExerciseVideo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('fitnessData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.profile) setUserProfile(prev => ({ ...prev, ...data.profile }));
        if (data.workouts) setWorkouts(data.workouts);
        if (data.bodyMetrics) setBodyMetrics(data.bodyMetrics);
        if (data.progressPhotos) setProgressPhotos(data.progressPhotos);
        if (data.painLog) setPainLog(data.painLog);
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fitnessData', JSON.stringify({
      profile: userProfile,
      workouts: workouts,
      bodyMetrics: bodyMetrics,
      progressPhotos: progressPhotos,
      painLog: painLog
    }));
  }, [userProfile, workouts, bodyMetrics, progressPhotos, painLog]);

  // Workout reminders
  useEffect(() => {
    if (!userProfile.reminderEnabled) return;

    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = userProfile.reminderTime.split(':');
      const reminderTime = new Date();
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const diff = Math.abs(now - reminderTime);
      if (diff < 60000) { // Within 1 minute
        const lastWorkout = workouts[workouts.length - 1];
        const daysSince = lastWorkout ? 
          Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)) : 999;

        if (daysSince >= 1 && Notification.permission === 'granted') {
          new Notification('RetireStrong Fitness Reminder', {
            body: 'Time for your workout! Even 10 minutes makes a difference.',
            icon: '/fitness-icon.png'
          });
        }
      }
    };

    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [userProfile.reminderEnabled, userProfile.reminderTime, workouts]);

  const exerciseLibrary = {
    resistance: [
      {
        name: 'Chair Squats',
        difficulty: 'beginner',
        muscleGroup: 'Legs',
        equipment: 'Chair (home/gym)',
        imageUrl: 'https://via.placeholder.com/400x300/0d9488/ffffff?text=Chair+Squats',
        instructions: '1. Stand in front of a sturdy chair\n2. Lower yourself until you lightly touch the seat\n3. Push through your heels to stand\n4. Keep chest up and core engaged',
        detailedSteps: [
          'Position yourself 6-12 inches in front of a sturdy chair',
          'Stand with feet shoulder-width apart, toes slightly pointed out',
          'Extend arms forward for balance',
          'Bend at hips and knees, lowering until buttocks lightly touch seat',
          'Keep weight in your heels, chest lifted, and back straight',
          'Push through heels to return to standing',
          'Squeeze glutes at the top of the movement'
        ],
        sets: '2-3',
        reps: '8-12',
        benefits: 'Strengthens legs and improves balance',
        trackable: true
      },
      {
        name: 'Wall Push-ups',
        difficulty: 'beginner',
        muscleGroup: 'Chest/Arms',
        equipment: 'Wall (home/gym)',
        imageUrl: 'https://via.placeholder.com/400x300/0d9488/ffffff?text=Wall+Push-ups',
        instructions: '1. Stand arm\'s length from wall\n2. Place hands on wall at shoulder height\n3. Bend elbows to lean toward wall\n4. Push back to starting position',
        detailedSteps: [
          'Stand facing a wall at arm\'s length distance',
          'Place hands flat on wall at shoulder height and width',
          'Keep feet hip-width apart for stability',
          'Bend elbows to lower chest toward wall',
          'Keep body in a straight line from head to heels',
          'Push back to starting position',
          'Breathe in as you lower, out as you push away'
        ],
        sets: '2-3',
        reps: '10-15',
        benefits: 'Builds upper body strength safely',
        trackable: true
      },
      {
        name: 'Seated Rows (Band)',
        difficulty: 'beginner',
        muscleGroup: 'Back',
        equipment: 'Resistance Band (home)',
        imageUrl: 'https://via.placeholder.com/400x300/0d9488/ffffff?text=Seated+Rows',
        instructions: '1. Sit with legs extended, band around feet\n2. Hold band handles with arms extended\n3. Pull elbows back, squeezing shoulder blades\n4. Slowly return to start',
        detailedSteps: [
          'Sit on floor with legs extended straight',
          'Wrap resistance band around both feet',
          'Hold one handle in each hand with arms fully extended',
          'Sit tall with chest up and shoulders back',
          'Pull handles toward torso, driving elbows back',
          'Squeeze shoulder blades together at the end',
          'Slowly release back to starting position with control'
        ],
        sets: '2-3',
        reps: '10-12',
        benefits: 'Improves posture and back strength',
        trackable: true
      },
      {
        name: 'Standing Bicep Curls',
        difficulty: 'intermediate',
        muscleGroup: 'Arms',
        equipment: 'Dumbbells (home/gym)',
        imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Bicep+Curls',
        instructions: '1. Stand with dumbbells in each hand\n2. Keep elbows close to body\n3. Curl weights toward shoulders\n4. Lower with control',
        detailedSteps: [
          'Stand with feet shoulder-width apart',
          'Hold dumbbells at sides with palms facing forward',
          'Keep elbows tucked close to your ribcage',
          'Curl weights up toward shoulders without moving upper arms',
          'Squeeze biceps at the top',
          'Lower dumbbells slowly and with control',
          'Avoid swinging or using momentum'
        ],
        sets: '2-3',
        reps: '10-15',
        benefits: 'Strengthens arms for daily activities',
        trackable: true
      },
      {
        name: 'Dumbbell Chest Press',
        difficulty: 'intermediate',
        muscleGroup: 'Chest',
        equipment: 'Dumbbells & Bench',
        imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Chest+Press',
        instructions: '1. Lie on bench with dumbbells at chest\n2. Press weights up until arms extended\n3. Lower with control\n4. Keep back flat',
        detailedSteps: [
          'Lie flat on bench with feet firmly on floor',
          'Hold dumbbells at chest level with elbows at 90 degrees',
          'Press weights up until arms are fully extended',
          'Keep wrists straight and aligned over elbows',
          'Lower dumbbells slowly until elbows are at 90 degrees',
          'Maintain natural arch in lower back',
          'Keep shoulder blades pulled back and down'
        ],
        sets: '3',
        reps: '8-12',
        benefits: 'Builds chest and arm strength',
        trackable: true
      },
      {
        name: 'Goblet Squats',
        difficulty: 'intermediate',
        muscleGroup: 'Legs',
        equipment: 'Dumbbell/Kettlebell',
        imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Goblet+Squats',
        instructions: '1. Hold weight at chest level\n2. Feet shoulder-width apart\n3. Squat down keeping chest up\n4. Drive through heels',
        detailedSteps: [
          'Hold dumbbell or kettlebell at chest with both hands',
          'Stand with feet slightly wider than shoulder-width',
          'Point toes slightly outward',
          'Keep elbows pointed down and chest up',
          'Lower into squat by bending knees and hips',
          'Go as low as comfortable while keeping heels down',
          'Drive through heels to return to standing'
        ],
        sets: '3',
        reps: '8-12',
        benefits: 'Full leg development',
        trackable: true
      },
      {
        name: 'Plank Hold',
        difficulty: 'intermediate',
        muscleGroup: 'Core',
        equipment: 'None',
        imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Plank+Hold',
        instructions: '1. Start on forearms and toes\n2. Keep body straight\n3. Engage core and glutes\n4. Hold 20-45 seconds',
        detailedSteps: [
          'Start on hands and knees on floor or mat',
          'Lower onto forearms with elbows under shoulders',
          'Extend legs back, balancing on toes',
          'Create straight line from head to heels',
          'Engage core by pulling belly button toward spine',
          'Squeeze glutes and keep hips level',
          'Look at floor to keep neck neutral',
          'Hold position for specified time'
        ],
        sets: '2-3',
        reps: 'Hold',
        benefits: 'Core strength',
        trackable: false
      }
    ],
    cardio: [
      {
        name: 'Brisk Walking',
        difficulty: 'beginner',
        duration: '15-30 min',
        equipment: 'None',
        imageUrl: 'https://via.placeholder.com/400x300/0d9488/ffffff?text=Brisk+Walking',
        instructions: 'Walk at a pace where you can talk but feel slightly breathless.',
        detailedSteps: [
          'Warm up with 5 minutes of slow walking',
          'Increase pace to brisk walk (3-4 mph)',
          'Swing arms naturally at your sides',
          'Keep shoulders back and head up',
          'Land on heel and roll through to toe',
          'Maintain steady breathing rhythm',
          'Cool down with 5 minutes slow walking'
        ],
        benefits: 'Heart health, low-impact'
      },
      {
        name: 'Stationary Bike',
        difficulty: 'intermediate',
        duration: '20-30 min',
        equipment: 'Bike',
        imageUrl: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Stationary+Bike',
        instructions: 'Cycle at moderate intensity. Adjust resistance to feel challenged.',
        detailedSteps: [
          'Adjust seat so leg is slightly bent at bottom of pedal stroke',
          'Warm up with 5 minutes low resistance',
          'Increase resistance to moderate level',
          'Maintain steady cadence (60-80 RPM)',
          'Keep upper body relaxed',
          'Breathe steadily throughout',
          'Cool down with 5 minutes low resistance'
        ],
        benefits: 'Low-impact cardio'
      }
    ],
    flexibility: [
      {
        name: 'Seated Hamstring Stretch',
        difficulty: 'beginner',
        duration: '30 sec each',
        equipment: 'Chair',
        imageUrl: 'https://via.placeholder.com/400x300/0d9488/ffffff?text=Hamstring+Stretch',
        instructions: 'Sit on edge of chair, extend one leg. Lean forward gently.',
        detailedSteps: [
          'Sit on edge of sturdy chair',
          'Extend one leg straight with heel on floor',
          'Keep other foot flat on floor with knee bent',
          'Place hands on bent knee for support',
          'Hinge forward from hips keeping back straight',
          'Feel stretch in back of extended leg',
          'Hold without bouncing',
          'Switch legs and repeat'
        ],
        benefits: 'Reduces lower back tension'
      }
    ],
    balance: [
      {
        name: 'Single Leg Stand',
        difficulty: 'beginner',
        duration: '30 sec each',
        equipment: 'Wall',
        imageUrl: 'https://via.placeholder.com/400x300/0d9488/ffffff?text=Balance+Stand',
        instructions: 'Stand near wall. Lift one foot slightly off ground.',
        detailedSteps: [
          'Stand next to wall with feet hip-width apart',
          'Lightly touch wall with fingertips for balance',
          'Shift weight to one leg',
          'Lift other foot 2-3 inches off floor',
          'Keep standing leg slightly bent',
          'Focus eyes on fixed point ahead',
          'Hold for 30 seconds',
          'As you improve, reduce wall contact',
          'Switch legs and repeat'
        ],
        benefits: 'Fall prevention'
      }
    ]
  };

  const nutritionTips = [
    {
      category: 'Protein',
      tip: 'Aim for 1-1.2g protein per kg body weight daily',
      foods: 'Lean meats, fish, eggs, Greek yogurt, legumes',
      why: 'Maintains muscle mass and aids recovery'
    },
    {
      category: 'Hydration',
      tip: 'Drink 8-10 glasses of water daily',
      foods: 'Water, herbal tea, fruits with high water content',
      why: 'Supports joint health and exercise performance'
    },
    {
      category: 'Calcium & Vitamin D',
      tip: '1200mg calcium, 800-1000 IU vitamin D daily',
      foods: 'Dairy, fortified alternatives, salmon, sunlight',
      why: 'Bone health and osteoporosis prevention'
    },
    {
      category: 'Anti-inflammatory Foods',
      tip: 'Include omega-3s and colorful vegetables',
      foods: 'Fatty fish, walnuts, berries, leafy greens',
      why: 'Reduces joint pain and inflammation'
    },
    {
      category: 'Timing',
      tip: 'Eat protein within 2 hours after exercise',
      foods: 'Protein shake, eggs, chicken, cottage cheese',
      why: 'Optimizes muscle recovery and growth'
    }
  ];

  const programs = {
    beginner: {
      week1: [
        { day: 'Monday', type: 'Resistance + Flexibility', exercises: ['Chair Squats', 'Wall Push-ups', 'Seated Hamstring Stretch'] },
        { day: 'Wednesday', type: 'Cardio + Balance', exercises: ['Brisk Walking', 'Single Leg Stand'] },
        { day: 'Friday', type: 'Full Body', exercises: ['Chair Squats', 'Seated Rows (Band)'] }
      ]
    },
    intermediate: {
      week1: [
        { day: 'Monday', type: 'Upper Body', exercises: ['Wall Push-ups', 'Seated Rows (Band)', 'Standing Bicep Curls'] },
        { day: 'Tuesday', type: 'Cardio', exercises: ['Stationary Bike', 'Brisk Walking'] },
        { day: 'Thursday', type: 'Lower Body', exercises: ['Goblet Squats', 'Chair Squats'] },
        { day: 'Saturday', type: 'Full Body', exercises: ['Plank Hold', 'Seated Rows (Band)'] }
      ]
    },
    advanced: {
      week1: [
        { day: 'Monday', type: 'Upper Body', exercises: ['Dumbbell Chest Press', 'Standing Bicep Curls', 'Plank Hold'] },
        { day: 'Tuesday', type: 'Cardio', exercises: ['Stationary Bike'] },
        { day: 'Wednesday', type: 'Lower Body', exercises: ['Goblet Squats', 'Chair Squats'] },
        { day: 'Friday', type: 'Active Recovery', exercises: ['Brisk Walking', 'Seated Hamstring Stretch'] },
        { day: 'Saturday', type: 'Full Body', exercises: ['Chair Squats', 'Wall Push-ups', 'Seated Rows (Band)'] }
      ]
    }
  };

  const getEnhancedAIRecommendation = () => {
    const recent = workouts.slice(-10).reverse();
    const last7Days = workouts.filter(w => {
      const date = new Date(w.date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return date >= sevenDaysAgo;
    });

    const avgRating = recent.reduce((sum, w) => sum + w.rating, 0) / (recent.length || 1);
    const recentTrend = recent.length >= 3 ? 
      (recent[0].rating + recent[1].rating) / 2 - (recent[recent.length-2].rating + recent[recent.length-1].rating) / 2 : 0;
    
    const workoutsThisWeek = last7Days.length;
    const workoutTypes = [...new Set(recent.map(w => w.type))];
    const hasVariety = workoutTypes.length >= 3;
    
    const daysSinceLastWorkout = workouts.length > 0 ? 
      Math.floor((Date.now() - new Date(workouts[workouts.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)) : 999;
    
    const hasArthritis = userProfile.healthConditions.includes('Arthritis');
    const hasBalanceIssues = userProfile.healthConditions.includes('Balance Issues');
    const recentPain = painLog.filter(p => {
      const date = new Date(p.date);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return date >= threeDaysAgo && p.severity >= 6;
    });

    let recommendation = '';
    let priority = 'info';

    if (recentPain.length > 0) {
      recommendation = `⚠️ You've logged significant pain recently. Consider: 1) Taking an extra rest day, 2) Consulting your healthcare provider, 3) Focusing on gentle stretching. Your health and safety come first.`;
      priority = 'warning';
    } else if (workoutsThisWeek >= 6 && avgRating < 3.5) {
      recommendation = `You've been very active with ${workoutsThisWeek} workouts this week, but energy is low. Recovery is when muscles grow stronger. Take a rest day or do gentle stretching.`;
      priority = 'warning';
    } else if (recentTrend > 0.5 && avgRating >= 4) {
      recommendation = `Excellent! Energy trending up (${avgRating.toFixed(1)}/5). You're building momentum. ${!hasVariety ? 'Try adding variety for balanced fitness.' : 'Great workout variety!'}`;
      priority = 'success';
    } else if (daysSinceLastWorkout >= 4) {
      recommendation = `It's been ${daysSinceLastWorkout} days since your last workout. Even 15 minutes helps maintain progress. Start gentle - walking or stretching is perfect.`;
      priority = 'warning';
    } else if (workoutsThisWeek >= userProfile.weeklyGoal && avgRating >= 3.5) {
      recommendation = `Crushing your ${userProfile.weeklyGoal} workout goal! Avg rating: ${avgRating.toFixed(1)}/5. ${hasArthritis ? 'Great job managing arthritis through movement!' : 'Keep this sustainable pace!'}`;
      priority = 'success';
    } else {
      recommendation = `Steady progress! Avg rating: ${avgRating.toFixed(1)}/5. ${hasBalanceIssues ? 'Keep prioritizing balance exercises.' : 'Listen to your body and adjust as needed.'}`;
      priority = 'info';
    }

    return { text: recommendation, priority };
  };

  const getCurrentStreak = () => {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      workoutDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
        currentDate = workoutDate;
      } else if (daysDiff <= 2) {
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    return streak;
  };

  const getAchievements = () => {
    const achievements = [];
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
    const streak = getCurrentStreak();
    
    if (totalWorkouts >= 1) achievements.push({ icon: '🎯', name: 'First Step', desc: 'First workout!' });
    if (totalWorkouts >= 10) achievements.push({ icon: '💪', name: 'Committed', desc: '10 workouts' });
    if (totalWorkouts >= 25) achievements.push({ icon: '🏆', name: 'Quarter Century', desc: '25 workouts' });
    if (totalWorkouts >= 50) achievements.push({ icon: '⭐', name: 'Half Century', desc: '50 workouts' });
    if (totalWorkouts >= 100) achievements.push({ icon: '👑', name: 'Century Club', desc: '100 workouts' });
    
    if (streak >= 3) achievements.push({ icon: '🔥', name: 'On Fire', desc: '3 day streak' });
    if (streak >= 7) achievements.push({ icon: '⚡', name: 'Week Warrior', desc: '7 days!' });
    if (streak >= 14) achievements.push({ icon: '🌟', name: 'Fortnight', desc: '14 days!' });
    if (streak >= 30) achievements.push({ icon: '💎', name: 'Monthly Master', desc: '30 days!' });
    
    if (totalMinutes >= 300) achievements.push({ icon: '🎖️', name: '5 Hour Hero', desc: '300+ min' });
    
    return achievements.slice(-6);
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);
    const totalMinutes = weekWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const avgRating = weekWorkouts.length > 0 
      ? (weekWorkouts.reduce((sum, w) => sum + w.rating, 0) / weekWorkouts.length).toFixed(1)
      : 0;
    
    return { count: weekWorkouts.length, minutes: totalMinutes, avgRating };
  };

  const getChartData = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentWorkouts = workouts.filter(w => new Date(w.date) >= thirtyDaysAgo);
    
    const dataMap = {};
    recentWorkouts.forEach(w => {
      const date = new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dataMap[date]) {
        dataMap[date] = { date, duration: 0, rating: 0, count: 0 };
      }
      dataMap[date].duration += w.duration;
      dataMap[date].rating += w.rating;
      dataMap[date].count += 1;
    });
    
    return Object.values(dataMap)
      .map(d => ({ ...d, rating: (d.rating / d.count).toFixed(1) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14);
  };

  const getBodyMetricsChart = () => {
    return bodyMetrics.map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: m.weight,
      waist: m.waist
    }));
  };

  const addWorkout = (workout) => {
    setWorkouts([...workouts, { ...workout, id: Date.now(), date: new Date().toISOString() }]);
    setShowAddWorkout(false);
  };

  const addBodyMetric = (metric) => {
    setBodyMetrics([...bodyMetrics, { ...metric, id: Date.now(), date: new Date().toISOString() }]);
  };

  const addPainLog = (log) => {
    setPainLog([...painLog, { ...log, id: Date.now(), date: new Date().toISOString() }]);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProgressPhotos([...progressPhotos, {
          id: Date.now(),
          date: new Date().toISOString(),
          dataUrl: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const shareAchievement = (achievement) => {
    const text = `I just earned the "${achievement.name}" achievement on RetireStrong Fitness! 🎉 ${achievement.desc}`;
    
    if (navigator.share) {
      navigator.share({ title: 'RetireStrong Achievement', text });
    } else {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Duration', 'Rating', 'Notes'];
    const rows = workouts.map(w => [
      new Date(w.date).toLocaleDateString(),
      w.type,
      w.duration,
      w.rating,
      `"${w.notes || ''}"`
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workout-history.csv';
    link.click();
  };

  const exportForHealthcare = () => {
    const summary = `
RetireStrong Fitness Report for ${userProfile.name}
Generated: ${new Date().toLocaleDateString()}

PROFILE:
- Age: ${userProfile.age}
- Experience: ${userProfile.experienceLevel}
- Health Conditions: ${userProfile.healthConditions.join(', ') || 'None'}
- Weekly Goal: ${userProfile.weeklyGoal} workouts

RECENT ACTIVITY (Last 30 Days):
- Total Workouts: ${workouts.filter(w => (Date.now() - new Date(w.date)) < 30*24*60*60*1000).length}
- Average Energy Rating: ${getWeeklyStats().avgRating}/5
- Current Streak: ${getCurrentStreak()} days

PAIN LOG (Recent):
${painLog.slice(-5).map(p => `- ${new Date(p.date).toLocaleDateString()}: ${p.location} (${p.severity}/10) - ${p.notes}`).join('\n')}

BODY METRICS (Latest):
${bodyMetrics.length > 0 ? `- Weight: ${bodyMetrics[bodyMetrics.length-1].weight} lbs\n- Waist: ${bodyMetrics[bodyMetrics.length-1].waist} inches` : 'No data'}
`;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fitness-healthcare-report.txt';
    link.click();
  };

  const printWorkoutCard = (program) => {
    const printContent = `
      <html>
        <head>
          <title>Workout Card</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #0d9488; }
            .exercise { margin: 15px 0; padding: 10px; border: 1px solid #ddd; }
            .exercise h3 { margin: 0 0 5px 0; }
          </style>
        </head>
        <body>
          <h1>RetireStrong Fitness - ${program.day}</h1>
          <h2>${program.type}</h2>
          ${program.exercises.map(ex => `<div class="exercise"><h3>✓ ${ex}</h3></div>`).join('')}
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const OverviewTab = () => {
    const stats = getWeeklyStats();
    const aiRecommendation = getEnhancedAIRecommendation();
    const todaysPlan = programs[userProfile.experienceLevel]?.week1?.[0];
    const streak = getCurrentStreak();
    const achievements = getAchievements();

    return (
      <div className="space-y-6">
        <div className={`rounded-xl p-5 border-2 ${
          aiRecommendation.priority === 'success' ? 'bg-green-50 border-green-200' :
          aiRecommendation.priority === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          'bg-teal-50 border-teal-200'
        }`}>
          <div className="flex items-start gap-3">
            <Heart className={`mt-1 flex-shrink-0 ${
              aiRecommendation.priority === 'success' ? 'text-green-600' :
              aiRecommendation.priority === 'warning' ? 'text-yellow-600' :
              'text-teal-600'
            }`} size={24} />
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">AI Coach Recommendation</h3>
              <p className="text-slate-700 text-base leading-relaxed">{aiRecommendation.text}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Activity className="text-teal-600" size={28} />
              <span className="text-3xl font-bold text-slate-900">{stats.count}</span>
            </div>
            <p className="text-slate-600 text-sm font-medium">This Week</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-600" size={28} />
              <span className="text-3xl font-bold text-slate-900">{stats.minutes}</span>
            </div>
            <p className="text-slate-600 text-sm font-medium">Minutes</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="text-yellow-600" size={28} />
              <span className="text-3xl font-bold text-slate-900">{stats.avgRating}</span>
            </div>
            <p className="text-slate-600 text-sm font-medium">Avg Rating</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Flame className="text-orange-600" size={28} />
              <span className="text-3xl font-bold text-slate-900">{streak}</span>
            </div>
            <p className="text-slate-600 text-sm font-medium">Day Streak</p>
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
            <h3 className="font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Award className="text-teal-600" size={24} />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 text-center relative group">
                  <div className="text-3xl mb-1">{ach.icon}</div>
                  <div className="font-semibold text-slate-900 text-sm">{ach.name}</div>
                  <div className="text-slate-600 text-xs">{ach.desc}</div>
                  <button
                    onClick={() => shareAchievement(ach)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Share2 size={16} className="text-teal-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {todaysPlan && (
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                <Target className="text-teal-600" size={24} />
                Today's Suggested Workout
              </h3>
              <button
                onClick={() => printWorkoutCard(todaysPlan)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-slate-500" size={20} />
              <span className="text-slate-600 text-base">{todaysPlan.day} - {todaysPlan.type}</span>
            </div>
            <div className="space-y-2">
              {todaysPlan.exercises.map((ex, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 text-base">
                  <CheckCircle className="text-green-500" size={18} />
                  <span>{ex}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddWorkout(true)}
              className="mt-4 w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-semibold text-base transition-colors"
            >
              Start This Workout
            </button>
          </div>
        )}
      </div>
    );
  };

  const ProgressTab = () => {
    const chartData = getChartData();
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-xl text-slate-900 mb-4">All-Time Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{totalWorkouts}</div>
              <div className="text-slate-600 text-sm">Total Workouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{totalHours}</div>
              <div className="text-slate-600 text-sm">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{getCurrentStreak()}</div>
              <div className="text-slate-600 text-sm">Current Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-xl text-slate-900 mb-4">Workout History (Last 14 Days)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="duration" stroke="#0d9488" fill="#5eead4" name="Duration (min)" />
                <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#f59e0b" strokeWidth={2} name="Energy" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-600 text-center py-8">Start logging workouts to see progress!</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-xl text-slate-900 mb-4">Export & Share</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={exportToCSV}
              className="flex flex-col items-center gap-2 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <Download size={24} className="text-teal-600" />
              <span className="text-sm font-medium text-slate-900">Export CSV</span>
            </button>
            <button
              onClick={exportForHealthcare}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Phone size={24} className="text-blue-600" />
              <span className="text-sm font-medium text-slate-900">Healthcare Report</span>
            </button>
            <button
              onClick={() => {
                const text = `I've completed ${totalWorkouts} workouts and ${totalHours} hours on RetireStrong Fitness!`;
                if (navigator.share) navigator.share({ text });
                else window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Share2 size={24} className="text-green-600" />
              <span className="text-sm font-medium text-slate-900">Share Progress</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const WorkoutsTab = () => {
    const [selectedCategory, setSelectedCategory] = useState('resistance');

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Exercise Library</h2>
          <button
            onClick={() => setShowAddWorkout(true)}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            Log Workout
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['resistance', 'cardio', 'flexibility', 'balance'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-lg font-semibold capitalize whitespace-nowrap ${
                selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {exerciseLibrary[selectedCategory]?.map((exercise, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{exercise.name}</h3>
                  <div className="flex gap-2 items-center flex-wrap mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exercise.difficulty}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {exercise.equipment}
                    </span>
                  </div>
                </div>
                {exercise.muscleGroup && (
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                    {exercise.muscleGroup}
                  </span>
                )}
              </div>
              
              {exercise.imageUrl && (
                <div className="mb-3">
                  <button
                    onClick={() => setSelectedExerciseVideo(exercise)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                  >
                    <CheckCircle size={16} />
                    View Detailed Instructions
                  </button>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-lg mb-3">
                <p className="font-semibold text-slate-900 mb-2">Instructions:</p>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">{exercise.instructions}</p>
              </div>

              {exercise.sets && (
                <p className="text-slate-700 text-sm mb-1">
                  <span className="font-semibold">Sets & Reps:</span> {exercise.sets} sets × {exercise.reps} reps
                </p>
              )}
              {exercise.duration && (
                <p className="text-slate-700 text-sm mb-1">
                  <span className="font-semibold">Duration:</span> {exercise.duration}
                </p>
              )}
              <p className="text-slate-600 text-xs mt-2">
                <span className="font-semibold">Benefits:</span> {exercise.benefits}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HealthTab = () => {
    const [showMetricForm, setShowMetricForm] = useState(false);
    const [showPainForm, setShowPainForm] = useState(false);
    const [newMetric, setNewMetric] = useState({ weight: '', waist: '', notes: '' });
    const [newPain, setNewPain] = useState({ location: '', severity: 5, notes: '' });
    const metricsChart = getBodyMetricsChart();

    return (
      <div className="space-y-6">
        {/* Body Metrics */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <Scale className="text-teal-600" size={24} />
              Body Measurements
            </h3>
            <button
              onClick={() => setShowMetricForm(!showMetricForm)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
            >
              <Plus size={16} className="inline mr-1" />
              Add Measurement
            </button>
          </div>

          {showMetricForm && (
            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={newMetric.weight}
                  onChange={(e) => setNewMetric({...newMetric, weight: e.target.value})}
                  className="p-2 border rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Waist (inches)"
                  value={newMetric.waist}
                  onChange={(e) => setNewMetric({...newMetric, waist: e.target.value})}
                  className="p-2 border rounded text-sm"
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={newMetric.notes}
                  onChange={(e) => setNewMetric({...newMetric, notes: e.target.value})}
                  className="p-2 border rounded text-sm"
                />
              </div>
              <button
                onClick={() => {
                  if (newMetric.weight || newMetric.waist) {
                    addBodyMetric({ 
                      weight: parseFloat(newMetric.weight) || 0, 
                      waist: parseFloat(newMetric.waist) || 0, 
                      notes: newMetric.notes 
                    });
                    setNewMetric({ weight: '', waist: '', notes: '' });
                    setShowMetricForm(false);
                  }
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
              >
                Save Measurement
              </button>
            </div>
          )}

          {metricsChart.length > 0 && (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metricsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="left" style={{ fontSize: '11px' }} />
                <YAxis yAxisId="right" orientation="right" style={{ fontSize: '11px' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#0d9488" name="Weight (lbs)" />
                <Line yAxisId="right" type="monotone" dataKey="waist" stroke="#f59e0b" name="Waist (in)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Progress Photos */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <Camera className="text-teal-600" size={24} />
              Progress Photos
            </h3>
            <label className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm cursor-pointer">
              <Camera size={16} className="inline mr-1" />
              Add Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {progressPhotos.map(photo => (
              <div key={photo.id} className="relative group">
                <img src={photo.dataUrl} alt="Progress" className="w-full h-32 object-cover rounded-lg" />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                  {new Date(photo.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          {progressPhotos.length === 0 && (
            <p className="text-slate-600 text-center py-4 text-sm">No photos yet. Take your first progress photo!</p>
          )}
        </div>

        {/* Pain Tracking */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
              <AlertCircle className="text-orange-600" size={24} />
              Pain & Discomfort Log
            </h3>
            <button
              onClick={() => setShowPainForm(!showPainForm)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
            >
              <Plus size={16} className="inline mr-1" />
              Log Pain
            </button>
          </div>

          {showPainForm && (
            <div className="mb-4 p-4 bg-orange-50 rounded-lg">
              <div className="space-y-3">
                <select
                  value={newPain.location}
                  onChange={(e) => setNewPain({...newPain, location: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Select location...</option>
                  <option>Knee</option>
                  <option>Back</option>
                  <option>Shoulder</option>
                  <option>Hip</option>
                  <option>Ankle</option>
                  <option>Wrist</option>
                  <option>Other</option>
                </select>
                <div>
                  <label className="text-sm text-slate-700">Severity: {newPain.severity}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newPain.severity}
                    onChange={(e) => setNewPain({...newPain, severity: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
                <textarea
                  placeholder="Describe the pain..."
                  value={newPain.notes}
                  onChange={(e) => setNewPain({...newPain, notes: e.target.value})}
                  className="w-full p-2 border rounded text-sm"
                  rows="2"
                />
              </div>
              <button
                onClick={() => {
                  if (newPain.location) {
                    addPainLog(newPain);
                    setNewPain({ location: '', severity: 5, notes: '' });
                    setShowPainForm(false);
                  }
                }}
                className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
              >
                Save Pain Log
              </button>
            </div>
          )}

          <div className="space-y-2">
            {painLog.slice(-5).reverse().map(log => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-900 text-sm">{log.location}</span>
                  <span className={`text-sm font-medium ${
                    log.severity >= 7 ? 'text-red-600' :
                    log.severity >= 4 ? 'text-orange-600' :
                    'text-yellow-600'
                  }`}>
                    {log.severity}/10
                  </span>
                </div>
                <p className="text-slate-600 text-xs">{new Date(log.date).toLocaleDateString()}</p>
                {log.notes && <p className="text-slate-700 text-sm mt-1">{log.notes}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Tips */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-xl text-slate-900 mb-4 flex items-center gap-2">
            <Apple className="text-teal-600" size={24} />
            Nutrition Guidelines for 60+
          </h3>
          <div className="space-y-3">
            {nutritionTips.map((tip, idx) => (
              <div key={idx} className="p-4 bg-teal-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-1">{tip.category}</h4>
                <p className="text-sm text-slate-700 mb-1">✓ {tip.tip}</p>
                <p className="text-xs text-slate-600"><strong>Foods:</strong> {tip.foods}</p>
                <p className="text-xs text-slate-600"><strong>Why:</strong> {tip.why}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SettingsTab = () => {
    const healthConditions = ['Arthritis', 'Osteoporosis', 'Heart Condition', 'Diabetes', 'High Blood Pressure', 'Balance Issues', 'Joint Replacement', 'Back Pain'];
    const fitnessGoals = ['Improve Strength', 'Increase Flexibility', 'Better Balance', 'Weight Management', 'Heart Health', 'Daily Activity', 'Pain Management'];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Settings & Profile</h2>

        {/* Personal Info */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Age</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Experience Level</label>
                <select
                  value={userProfile.experienceLevel}
                  onChange={(e) => setUserProfile({...userProfile, experienceLevel: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Workout Location</label>
                <select
                  value={userProfile.workoutLocation}
                  onChange={(e) => setUserProfile({...userProfile, workoutLocation: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="home">Home</option>
                  <option value="gym">Gym</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Weekly Goal</label>
                <input
                  type="number"
                  value={userProfile.weeklyGoal}
                  onChange={(e) => setUserProfile({...userProfile, weeklyGoal: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                  min="1"
                  max="7"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="text-teal-600" size={20} />
            Workout Reminders
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={userProfile.reminderEnabled}
                onChange={(e) => setUserProfile({...userProfile, reminderEnabled: e.target.checked})}
                className="w-5 h-5"
              />
              <span className="text-slate-700">Enable daily workout reminders</span>
            </label>
            {userProfile.reminderEnabled && (
              <div>
                <label className="block text-slate-700 text-sm mb-1">Reminder Time:</label>
                <input
                  type="time"
                  value={userProfile.reminderTime}
                  onChange={(e) => setUserProfile({...userProfile, reminderTime: e.target.value})}
                  className="p-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <Pill className="text-teal-600" size={20} />
            Medications & Supplements
          </h3>
          <textarea
            placeholder="List your medications and supplements here..."
            value={userProfile.medications?.join('\n') || ''}
            onChange={(e) => setUserProfile({...userProfile, medications: e.target.value.split('\n')})}
            className="w-full p-3 border rounded-lg"
            rows="4"
          />
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <Phone className="text-red-600" size={20} />
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {[0, 1].map(idx => (
              <div key={idx} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={userProfile.emergencyContacts?.[idx]?.name || ''}
                  onChange={(e) => {
                    const contacts = [...(userProfile.emergencyContacts || [])];
                    contacts[idx] = { ...contacts[idx], name: e.target.value };
                    setUserProfile({...userProfile, emergencyContacts: contacts});
                  }}
                  className="p-2 border rounded-lg text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={userProfile.emergencyContacts?.[idx]?.phone || ''}
                  onChange={(e) => {
                    const contacts = [...(userProfile.emergencyContacts || [])];
                    contacts[idx] = { ...contacts[idx], phone: e.target.value };
                    setUserProfile({...userProfile, emergencyContacts: contacts});
                  }}
                  className="p-2 border rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Health Conditions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Health Conditions</h3>
          <div className="grid grid-cols-2 gap-3">
            {healthConditions.map(condition => (
              <label key={condition} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userProfile.healthConditions.includes(condition)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...userProfile.healthConditions, condition]
                      : userProfile.healthConditions.filter(c => c !== condition);
                    setUserProfile({...userProfile, healthConditions: updated});
                  }}
                  className="w-4 h-4"
                />
                <span className="text-slate-700 text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Fitness Goals</h3>
          <div className="grid grid-cols-2 gap-3">
            {fitnessGoals.map(goal => (
              <label key={goal} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userProfile.fitnessGoals.includes(goal)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...userProfile.fitnessGoals, goal]
                      : userProfile.fitnessGoals.filter(g => g !== goal);
                    setUserProfile({...userProfile, fitnessGoals: updated});
                  }}
                  className="w-4 h-4"
                />
                <span className="text-slate-700 text-sm">{goal}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AddWorkoutModal = () => {
    const [newWorkout, setNewWorkout] = useState({
      type: '',
      duration: 30,
      rating: 3,
      notes: '',
      exercises: []
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Log Your Workout</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Workout Type</label>
              <select
                value={newWorkout.type}
                onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select type...</option>
                <option value="Resistance Training">Resistance Training</option>
                <option value="Cardio">Cardio</option>
                <option value="Walking">Walking</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Balance">Balance</option>
                <option value="Mixed">Mixed Workout</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({...newWorkout, duration: parseInt(e.target.value)})}
                className="w-full p-3 border rounded-lg"
                min="5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-2">How Did You Feel?</label>
              <div className="flex gap-2 justify-center py-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setNewWorkout({...newWorkout, rating})}
                    className="transition-transform hover:scale-110"
                  >
                    <Heart
                      size={36}
                      className={rating <= newWorkout.rating ? 'fill-red-500 text-red-500' : 'text-slate-300'}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-slate-600 text-sm">
                {['Very Tired', 'Tired', 'Good', 'Great', 'Excellent'][newWorkout.rating - 1]}
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-2">Notes</label>
              <textarea
                value={newWorkout.notes}
                onChange={(e) => setNewWorkout({...newWorkout, notes: e.target.value})}
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="How did it go? Any achievements?"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddWorkout(false)}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => newWorkout.type && addWorkout(newWorkout)}
              disabled={!newWorkout.type}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:bg-slate-300 font-semibold"
            >
              Save Workout
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VideoModal = () => {
    if (!selectedExerciseVideo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-slate-900">{selectedExerciseVideo.name}</h3>
            <button
              onClick={() => setSelectedExerciseVideo(null)}
              className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <img 
              src={selectedExerciseVideo.imageUrl} 
              alt={selectedExerciseVideo.name}
              className="w-full rounded-lg shadow-md"
            />
          </div>

          {selectedExerciseVideo.detailedSteps && (
            <div className="mb-4 p-4 bg-teal-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="text-teal-600" size={20} />
                Step-by-Step Instructions:
              </h4>
              <ol className="space-y-2">
                {selectedExerciseVideo.detailedSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-lg mb-3">
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">{selectedExerciseVideo.instructions}</p>
          </div>

          {selectedExerciseVideo.sets && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-slate-800 mb-1">
                <span className="font-semibold">Sets & Reps:</span> {selectedExerciseVideo.sets} sets × {selectedExerciseVideo.reps} reps
              </p>
              <p className="text-slate-700 text-sm">
                <span className="font-semibold">Benefits:</span> {selectedExerciseVideo.benefits}
              </p>
            </div>
          )}

          {selectedExerciseVideo.duration && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-slate-800 mb-1">
                <span className="font-semibold">Duration:</span> {selectedExerciseVideo.duration}
              </p>
              <p className="text-slate-700 text-sm">
                <span className="font-semibold">Benefits:</span> {selectedExerciseVideo.benefits}
              </p>
            </div>
          )}

          <button
            onClick={() => setSelectedExerciseVideo(null)}
            className="w-full mt-4 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'progress', name: 'Progress', icon: BarChart3 },
    { id: 'workouts', name: 'Exercises', icon: Dumbbell },
    { id: 'programs', name: 'Programs', icon: Calendar },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const ProgramsTab = () => {
    const currentProgram = programs[userProfile.experienceLevel]?.week1 || [];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Training Program</h2>
          <p className="text-slate-600">
            {userProfile.experienceLevel.charAt(0).toUpperCase() + userProfile.experienceLevel.slice(1)} Level - Week 1
          </p>
        </div>

        <div className="bg-teal-50 rounded-xl p-5 border-2 border-teal-200">
          <h3 className="font-bold text-lg text-slate-900 mb-3">Program Guidelines</h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
              <span>Warm up for 5 minutes before each session</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
              <span>Rest 60-90 seconds between exercises</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
              <span>Cool down and stretch for 5 minutes after</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
              <span>Stop if you feel pain - discomfort is normal, pain is not</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          {currentProgram.map((day, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{day.day}</h3>
                  <p className="text-slate-600">{day.type}</p>
                </div>
                <button
                  onClick={() => printWorkoutCard(day)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  <Printer size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {day.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                    <span className="text-slate-700">{ex}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAddWorkout(true)}
                className="mt-4 w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 font-semibold"
              >
                Log This Workout
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-teal-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <ellipse cx="100" cy="50" rx="8" ry="14" fill="#5a9e99" transform="rotate(-20 100 50)"/>
                <ellipse cx="70" cy="65" rx="8" ry="14" fill="#5a9e99" transform="rotate(-45 70 65)"/>
                <ellipse cx="130" cy="65" rx="8" ry="14" fill="#5a9e99" transform="rotate(45 130 65)"/>
                <ellipse cx="50" cy="90" rx="8" ry="14" fill="#5a9e99" transform="rotate(-60 50 90)"/>
                <ellipse cx="150" cy="90" rx="8" ry="14" fill="#5a9e99" transform="rotate(60 150 90)"/>
                <ellipse cx="45" cy="115" rx="8" ry="14" fill="#5a9e99" transform="rotate(-75 45 115)"/>
                <ellipse cx="155" cy="115" rx="8" ry="14" fill="#5a9e99" transform="rotate(75 155 115)"/>
                <ellipse cx="55" cy="140" rx="8" ry="14" fill="#5a9e99" transform="rotate(-85 55 140)"/>
                <ellipse cx="145" cy="140" rx="8" ry="14" fill="#5a9e99" transform="rotate(85 145 140)"/>
                <circle cx="100" cy="80" r="12" fill="#1e5f5c"/>
                <path d="M100 92 L85 120 L85 160 L115 160 L115 120 Z" fill="#1e5f5c"/>
                <path d="M85 110 L60 105 L60 115 L85 120 Z" fill="#1e5f5c"/>
                <path d="M115 110 L140 105 L140 115 L115 120 Z" fill="#1e5f5c"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teal-700">RetireStrong</h1>
              <p className="text-lg text-teal-600 tracking-wider">FITNESS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userProfile.name && (
              <div className="text-right mr-4">
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-semibold text-slate-900">{userProfile.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="flex border-b overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'workouts' && <WorkoutsTab />}
        {activeTab === 'programs' && <ProgramsTab />}
        {activeTab === 'health' && <HealthTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {showAddWorkout && <AddWorkoutModal />}
      {selectedExerciseVideo && <VideoModal />}
    </div>
  );
};

export default FitnessApp;