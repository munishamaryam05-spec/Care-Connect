import type { Language } from './supabase';

export type TranslationKey =
  | 'appName'
  | 'tagline'
  | 'selectLanguage'
  | 'english'
  | 'kannada'
  | 'malayalam'
  | 'hindi'
  | 'signIn'
  | 'signUp'
  | 'signOut'
  | 'email'
  | 'password'
  | 'name'
  | 'iAmA'
  | 'senior'
  | 'caregiver'
  | 'createAccount'
  | 'alreadyHaveAccount'
  | 'dontHaveAccount'
  | 'loading'
  | 'error'
  | 'success'
  | 'cancel'
  | 'save'
  | 'delete'
  | 'edit'
  | 'close'
  | 'back'
  | 'next'
  | 'submit'
  | 'confirm'
  | 'iAmOkay'
  | 'iWantToTalk'
  | 'iNeedHelp'
  | 'letCaregiverKnowFine'
  | 'requestCallFromCaregiver'
  | 'sendHelpRequestToCaregiver'
  | 'todayReminders'
  | 'contactTrustedPerson'
  | 'contactCaregiverDirectly'
  | 'trustedContact'
  | 'openDialer'
  | 'goodMorning'
  | 'goodAfternoon'
  | 'goodEvening'
  | 'howAreYouToday'
  | 'assistant'
  | 'typeMessage'
  | 'send'
  | 'speak'
  | 'stopListening'
  | 'voiceNotSupported'
  | 'readAloud'
  | 'suggestedPrompts'
  | 'explainReminder'
  | 'contactFamily'
  | 'requestHelp'
  | 'aiMedicalDisclaimer'
  | 'aiThinking'
  | 'healthReminders'
  | 'healthReadings'
  | 'readingsTab'
  | 'remindersTab'
  | 'addReading'
  | 'editReading'
  | 'bloodPressure'
  | 'bloodGlucose'
  | 'weight'
  | 'temperature'
  | 'enteredByUser'
  | 'enteredByCaregiver'
  | 'noReadings'
  | 'noReminders'
  | 'addReminder'
  | 'editReminder'
  | 'medicine'
  | 'appointment'
  | 'dailyCheckin'
  | 'other'
  | 'manualEntryNotice'
  | 'bpHelp'
  | 'glucoseHelp'
  | 'helpRequests'
  | 'requestACall'
  | 'askForAssistance'
  | 'pending'
  | 'acknowledged'
  | 'handled'
  | 'cancelRequest'
  | 'emergencyDisclaimer'
  | 'notAnEmergencyService'
  | 'nationalEmergency'
  | 'seniorHelpline'
  | 'caregiverDashboard'
  | 'linkedSeniors'
  | 'allRequests'
  | 'overview'
  | 'latestCheckin'
  | 'pendingRequests'
  | 'acknowledgeRequest'
  | 'markHandled'
  | 'noLinkedSeniors'
  | 'noLinkedSeniorsSub'
  | 'privacyTitle'
  | 'privacyBody'
  | 'consentTitle'
  | 'consentBody'
  | 'shareHealthReadings'
  | 'shareCheckins'
  | 'revokeAccess'
  | 'demoMode'
  | 'demoNotice'
  | 'demoSwitcherTitle'
  | 'resetDemoData'
  | 'exitDemo'
  | 'settings'
  | 'language'
  | 'profile'
  | 'missedCheckin'
  | 'missedCheckinNote'
  | 'checkInStatusOkay'
  | 'checkInStatusWantsCall'
  | 'checkInStatusNeedsHelp'
  | 'noCheckinYet'
  | 'timeAgo'
  | 'justNow'
  | 'minutesAgo'
  | 'hoursAgo'
  | 'yesterday'
  | 'daysAgo'
  | 'addHealthReading'
  | 'value'
  | 'unit'
  | 'date'
  | 'notes'
  | 'type'
  | 'title'
  | 'time'
  | 'recurrence'
  | 'daily'
  | 'weekly'
  | 'once'
  | 'active'
  | 'inactive'
  | 'confirmHelpRequest'
  | 'confirmHelpBody'
  | 'confirmDeleteTitle'
  | 'confirmDeleteBody'
  | 'yes'
  | 'no'
  | 'home'
  | 'chat'
  | 'health'
  | 'requests'
  | 'invalidEmail'
  | 'invalidPassword'
  | 'requiredField'
  | 'aiUnavailable'
  | 'loginError'
  | 'signupError'
  | 'requestCreated'
  | 'checkinSaved'
  | 'readingSaved'
  | 'reminderSaved'
  | 'viewDetails'
  | 'requestedAt'
  | 'noRequestsYet'
  | 'requestFrom'
  | 'requestTypeLabel'
  | 'requestStatusLabel'
  | 'requestSummaryLabel'
  | 'requestDetails'
  | 'caregiverFollowUp'
  | 'welcomeTitle'
  | 'welcomeSubtitle'
  | 'tryDemoMode'
  | 'demoModeDesc'
  | 'exploreAsSenior'
  | 'exploreAsCaregiver'
  | 'supabaseStatusConnected'
  | 'supabaseStatusDemoOnly'
  | 'supabaseSetupGuide'
  | 'supabaseMissingNotice'
  | 'backToWelcome'
  | 'signInWithAccount'
  | 'featureVoice'
  | 'featureCheckin'
  | 'featurePrivacy';

export type Translations = Record<TranslationKey, string>;
export type TranslationMap = Record<Language, Translations>;

export const translations: TranslationMap = {
  en: {
    appName: 'CareConnect',
    tagline: 'Caring connections, every day',
    selectLanguage: 'Select Language',
    english: 'English',
    kannada: 'ಕನ್ನಡ',
    malayalam: 'മലയാളം',
    hindi: 'हिंदी',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    name: 'Your Name',
    iAmA: 'I am an',
    senior: 'Older Adult',
    caregiver: 'Caregiver',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account? Sign in',
    dontHaveAccount: "Don't have an account? Sign up",
    loading: 'Loading...',
    error: 'Something went wrong. Please try again.',
    success: 'Done!',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    confirm: 'Confirm',
    iAmOkay: "I'm Okay",
    iWantToTalk: 'I Want to Talk',
    iNeedHelp: 'I Need Help',
    letCaregiverKnowFine: "Let your caregiver know you're fine today",
    requestCallFromCaregiver: 'Request a friendly call from your caregiver',
    sendHelpRequestToCaregiver: 'Send a prompt help request to your caregiver',
    todayReminders: "Today's Reminders",
    contactTrustedPerson: 'Contact Trusted Person',
    contactCaregiverDirectly: 'Contact Caregiver Directly',
    trustedContact: 'Trusted Contact',
    openDialer: 'Open Phone Call',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    howAreYouToday: 'How are you feeling today?',
    assistant: 'Care Assistant',
    typeMessage: 'Type your message...',
    send: 'Send',
    speak: 'Tap to speak',
    stopListening: 'Stop listening',
    voiceNotSupported: 'Voice input is not supported in this browser. Please type your message.',
    readAloud: 'Read aloud',
    suggestedPrompts: 'Suggested questions',
    explainReminder: 'Explain my reminder',
    contactFamily: 'Contact my family',
    requestHelp: 'I need assistance',
    aiMedicalDisclaimer: 'This assistant provides reminder help and supportive conversation. It is not a medical professional and cannot diagnose or prescribe.',
    aiThinking: 'Thinking...',
    healthReminders: 'Health & Reminders',
    healthReadings: 'Health Readings',
    readingsTab: 'Readings',
    remindersTab: 'Reminders',
    addReading: 'Add Reading',
    editReading: 'Edit Reading',
    bloodPressure: 'Blood Pressure',
    bloodGlucose: 'Blood Glucose',
    weight: 'Weight',
    temperature: 'Temperature',
    enteredByUser: 'Entered by me',
    enteredByCaregiver: 'Entered by caregiver',
    noReadings: 'No readings recorded yet.',
    noReminders: 'No reminders scheduled.',
    addReminder: 'Add Reminder',
    editReminder: 'Edit Reminder',
    medicine: 'Medicine',
    appointment: 'Appointment',
    dailyCheckin: 'Daily Check-in',
    other: 'Other',
    manualEntryNotice: 'All readings are manually entered by you or your caregiver. This app does not measure or claim to diagnose vital signs.',
    bpHelp: 'Format: Systolic/Diastolic (e.g. 120/80 mmHg)',
    glucoseHelp: 'Value in mg/dL (e.g. 110)',
    helpRequests: 'Help Requests',
    requestACall: 'Request a Call',
    askForAssistance: 'Ask for Assistance',
    pending: 'Pending',
    acknowledged: 'Acknowledged',
    handled: 'Handled',
    cancelRequest: 'Cancel Request',
    emergencyDisclaimer: 'This app is a coordination tool, not an emergency service. For acute medical emergencies, call national emergency services or a trusted person immediately.',
    notAnEmergencyService: 'Not an Emergency Service',
    nationalEmergency: 'National Emergency: 112',
    seniorHelpline: 'Elder Helpline: 14567',
    caregiverDashboard: 'Caregiver Dashboard',
    linkedSeniors: 'Linked Older Adults',
    allRequests: 'All Requests',
    overview: 'Overview',
    latestCheckin: 'Latest Check-in',
    pendingRequests: 'Pending Requests',
    acknowledgeRequest: 'Acknowledge Request',
    markHandled: 'Mark as Handled',
    noLinkedSeniors: 'No older adults linked yet.',
    noLinkedSeniorsSub: 'Older adults need to be linked with your caregiver account.',
    privacyTitle: 'Your Privacy & Consent',
    privacyBody: 'Personal information and health readings are shared only with explicitly approved caregivers. You have full dignity, privacy, and control.',
    consentTitle: 'Granular Permissions',
    consentBody: 'You choose whether to share check-in statuses, health readings, or reminders. Permissions can be revoked at any time.',
    shareHealthReadings: 'Share health readings with caregiver',
    shareCheckins: 'Share daily check-ins with caregiver',
    revokeAccess: 'Revoke Access',
    demoMode: 'DEMO MODE',
    demoNotice: 'Demo Mode: fictional sample users and fictional data. Never mixed with real patients.',
    demoSwitcherTitle: 'Switch Demo User',
    resetDemoData: 'Reset Demo Data',
    exitDemo: 'Exit Demo',
    settings: 'Settings',
    language: 'Language',
    profile: 'Profile',
    missedCheckin: 'Missed check-in',
    missedCheckinNote: 'A missed check-in is not proof of an emergency. Please follow up with a gentle call.',
    checkInStatusOkay: 'Feeling okay',
    checkInStatusWantsCall: 'Wants a call',
    checkInStatusNeedsHelp: 'Needs assistance',
    noCheckinYet: 'No check-in yet today',
    timeAgo: 'ago',
    justNow: 'just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    yesterday: 'yesterday',
    daysAgo: 'days ago',
    addHealthReading: 'Add Health Reading',
    value: 'Value',
    unit: 'Unit',
    date: 'Date & Time',
    notes: 'Optional Notes',
    type: 'Type',
    title: 'Title',
    time: 'Time',
    recurrence: 'Recurrence',
    daily: 'Daily',
    weekly: 'Weekly',
    once: 'Once',
    active: 'Active',
    inactive: 'Inactive',
    confirmHelpRequest: 'Confirm Help Request',
    confirmHelpBody: 'Would you like to send a help request to your trusted caregiver right now?',
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteBody: 'Are you sure you want to delete this entry? This action cannot be undone.',
    yes: 'Yes, proceed',
    no: 'No, cancel',
    home: 'Home',
    chat: 'Assistant',
    health: 'Health',
    requests: 'Requests',
    invalidEmail: 'Please enter a valid email address.',
    invalidPassword: 'Password must be at least 6 characters.',
    requiredField: 'This field is required.',
    aiUnavailable: 'Care Assistant is temporarily unavailable. Please contact your caregiver directly or tap Request a Call.',
    loginError: 'Sign in failed. Please verify credentials.',
    signupError: 'Could not create account. Please try again.',
    requestCreated: 'Your help request was sent to your caregiver.',
    checkinSaved: 'Your wellbeing check-in was recorded.',
    readingSaved: 'Health reading saved successfully.',
    reminderSaved: 'Reminder saved successfully.',
    viewDetails: 'View Details',
    requestedAt: 'Requested',
    noRequestsYet: 'No help requests yet.',
    requestFrom: 'From',
    requestTypeLabel: 'Request Type',
    requestStatusLabel: 'Current Status',
    requestSummaryLabel: 'Summary',
    requestDetails: 'Help Request Details',
    caregiverFollowUp: 'Caregiver Follow-up',
    welcomeTitle: 'Welcome to CareConnect',
    welcomeSubtitle: 'Empowering older adults living alone with simple daily check-ins, medication reminders, and trusted caregiver connection.',
    tryDemoMode: 'Try Demo Mode',
    demoModeDesc: 'Experience all features immediately with pre-seeded demonstration accounts. No database setup needed.',
    exploreAsSenior: 'Enter as Older Adult (Kamala Devi)',
    exploreAsCaregiver: 'Enter as Caregiver (Priya Sharma)',
    supabaseStatusConnected: 'Live Supabase Connected',
    supabaseStatusDemoOnly: 'Demo Mode Ready (Supabase setup optional)',
    supabaseSetupGuide: 'How to Connect Supabase',
    supabaseMissingNotice: 'Live sign-in requires Supabase environment variables in .env. Use Demo Mode above to test all features right now without setup!',
    backToWelcome: 'Back to Welcome',
    signInWithAccount: 'Sign In with Account',
    featureVoice: 'Multilingual Voice & Chat',
    featureCheckin: 'One-Tap Wellbeing Check-in',
    featurePrivacy: 'Privacy-First Care Coordination',
  },
  kn: {
    appName: 'ಕೇರ್‌ಕನೆಕ್ಟ್',
    tagline: 'ಪ್ರತಿದಿನ ಕಾಳಜಿಯ ಸಂಪರ್ಕ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
    english: 'English',
    kannada: 'ಕನ್ನಡ',
    malayalam: 'മലയാളം',
    hindi: 'हिंदी',
    signIn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    signUp: 'ನೋಂದಾಯಿಸಿ',
    signOut: 'ಲಾಗ್ ಔಟ್',
    email: 'ಇಮೇಲ್',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    name: 'ನಿಮ್ಮ ಹೆಸರು',
    iAmA: 'ನಾನು',
    senior: 'ಹಿರಿಯ ವ್ಯಕ್ತಿ',
    caregiver: 'ಆರೈಕೆದಾರರು',
    createAccount: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ',
    dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ? ನೋಂದಾಯಿಸಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    error: 'ಏನೋ ತಪ್ಪಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    success: 'ಮಾಡಲಾಯಿತು!',
    cancel: 'ರದ್ದು ಮಾಡಿ',
    save: 'ಉಳಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ಬದಲಾಯಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    submit: 'ಸಲ್ಲಿಸಿ',
    confirm: 'ದೃಢಪಡಿಸಿ',
    iAmOkay: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ',
    iWantToTalk: 'ನಾನು ಮಾತನಾಡಬೇಕು',
    iNeedHelp: 'ನನಗೆ ಸಹಾಯ ಬೇಕು',
    letCaregiverKnowFine: 'ಇಂದು ನೀವು ಕ್ಷೇಮವಾಗಿದ್ದೀರಿ ಎಂದು ಆರೈಕೆದಾರರಿಗೆ ತಿಳಿಸಿ',
    requestCallFromCaregiver: 'ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಂದ ಕರೆಯನ್ನು ವಿನಂತಿಸಿ',
    sendHelpRequestToCaregiver: 'ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ತಕ್ಷಣ ಸಹಾಯದ ವಿನಂತಿ ಕಳುಹಿಸಿ',
    todayReminders: 'ಇಂದಿನ ಜ್ಞಾಪಕಗಳು',
    contactTrustedPerson: 'ನಂಬಿಕೆಯ ವ್ಯಕ್ತಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ',
    contactCaregiverDirectly: 'ಆರೈಕೆದಾರರನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ',
    trustedContact: 'ನಂಬಿಕೆಯ ಸಂಪರ್ಕ',
    openDialer: 'ಫೋನ್ ಕರೆ ಮಾಡಿ',
    goodMorning: 'ಶುಭ ಮುಂಜಾನೆ',
    goodAfternoon: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    goodEvening: 'ಶುಭ ಸಂಜೆ',
    howAreYouToday: 'ಇಂದು ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    assistant: 'ಆರೈಕೆ ಸಹಾಯಕ',
    typeMessage: 'ನಿಮ್ಮ ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ...',
    send: 'ಕಳುಹಿಸಿ',
    speak: 'ಮಾತನಾಡಲು ಒತ್ತಿ',
    stopListening: 'ನಿಲ್ಲಿಸಿ',
    voiceNotSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.',
    readAloud: 'ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
    suggestedPrompts: 'ಸೂಚಿತ ಪ್ರಶ್ನೆಗಳು',
    explainReminder: 'ನನ್ನ ಜ್ಞಾಪಕ ವಿವರಿಸಿ',
    contactFamily: 'ನನ್ನ ಕುಟುಂಬವನ್ನು ಸಂಪರ್ಕಿಸಿ',
    requestHelp: 'ನನಗೆ ಸಹಾಯ ಬೇಕು',
    aiMedicalDisclaimer: 'ಈ ಸಹಾಯಕ ಕಾಳಜಿ ಮತ್ತು ಜ್ಞಾಪಕಗಳ ಸಹಾಯ ನೀಡುತ್ತದೆ. ಇದು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಅಥವಾ ರೋಗನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ.',
    aiThinking: 'ಯೋಚಿಸುತ್ತಿದೆ...',
    healthReminders: 'ಆರೋಗ್ಯ ಮತ್ತು ಜ್ಞಾಪಕಗಳು',
    healthReadings: 'ಆರೋಗ್ಯ ರೀಡಿಂಗ್‌ಗಳು',
    readingsTab: 'ರೀಡಿಂಗ್‌ಗಳು',
    remindersTab: 'ಜ್ಞಾಪಕಗಳು',
    addReading: 'ರೀಡಿಂಗ್ ಸೇರಿಸಿ',
    editReading: 'ರೀಡಿಂಗ್ ಬದಲಾಯಿಸಿ',
    bloodPressure: 'ರಕ್ತದ ಒತ್ತಡ',
    bloodGlucose: 'ರಕ್ತದ ಸಕ್ಕರೆ',
    weight: 'ತೂಕ',
    temperature: 'ತಾಪಮಾನ',
    enteredByUser: 'ನಾನೇ ನಮೂದಿಸಿದ್ದೇನೆ',
    enteredByCaregiver: 'ಆರೈಕೆದಾರರು ನಮೂದಿಸಿದ್ದಾರೆ',
    noReadings: 'ಯಾವುದೇ ರೀಡಿಂಗ್ ದಾಖಲಿಸಿಲ್ಲ.',
    noReminders: 'ಯಾವುದೇ ಜ್ಞಾಪಕ ಹೊಂದಿಸಿಲ್ಲ.',
    addReminder: 'ಜ್ಞಾಪಕ ಸೇರಿಸಿ',
    editReminder: 'ಜ್ಞಾಪಕ ಬದಲಾಯಿಸಿ',
    medicine: 'ಔಷಧ',
    appointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
    dailyCheckin: 'ದೈನಂದಿನ ಚೆಕ್-ಇನ್',
    other: 'ಇತರ',
    manualEntryNotice: 'ಎಲ್ಲಾ ರೀಡಿಂಗ್‌ಗಳನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಲಾಗಿದೆ. ಈ ಅಪ್ಲಿಕೇಶನ್ ರೋಗನಿರ್ಣಯ ಮಾಡುವುದಿಲ್ಲ.',
    bpHelp: 'ಮಾದರಿ: ಸಿಸ್ಟೋಲಿಕ್/ಡಯಾಸ್ಟೋಲಿಕ್ (ಉದಾ. 120/80 mmHg)',
    glucoseHelp: 'ಮೌಲ್ಯ mg/dL ನಲ್ಲಿ (ಉದಾ. 110)',
    helpRequests: 'ಸಹಾಯದ ವಿನಂತಿಗಳು',
    requestACall: 'ಕರೆ ವಿನಂತಿ ಮಾಡಿ',
    askForAssistance: 'ಸಹಾಯ ಕೇಳಿ',
    pending: 'ಬಾಕಿ',
    acknowledged: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    handled: 'ನಿರ್ವಹಿಸಲಾಗಿದೆ',
    cancelRequest: 'ವಿನಂತಿ ರದ್ದು ಮಾಡಿ',
    emergencyDisclaimer: 'ಈ ಆ್ಯಪ್ ತುರ್ತು ಸೇವೆ ಅಲ್ಲ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 112 ಗೆ ಅಥವಾ ನಂಬಿಕೆಯ ವ್ಯಕ್ತಿಗೆ ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ.',
    notAnEmergencyService: 'ತುರ್ತು ಸೇವೆ ಅಲ್ಲ',
    nationalEmergency: 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಂಖ್ಯೆ: 112',
    seniorHelpline: 'ಹಿರಿಯ ನಾಗರಿಕರ ಸಹಾಯವಾಣಿ: 14567',
    caregiverDashboard: 'ಆರೈಕೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    linkedSeniors: 'ನಾನು ಆರೈಕೆ ಮಾಡುವ ಹಿರಿಯರು',
    allRequests: 'ಎಲ್ಲಾ ವಿನಂತಿಗಳು',
    overview: 'ಅವಲೋಕನ',
    latestCheckin: 'ಇತ್ತೀಚಿನ ಚೆಕ್-ಇನ್',
    pendingRequests: 'ಬಾಕಿ ವಿನಂತಿಗಳು',
    acknowledgeRequest: 'ಸ್ವೀಕರಿಸಿ',
    markHandled: 'ನಿರ್ವಹಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ',
    noLinkedSeniors: 'ಯಾವುದೇ ಹಿರಿಯರು ಲಿಂಕ್ ಆಗಿಲ್ಲ.',
    noLinkedSeniorsSub: 'ಹಿರಿಯರ ಖಾತೆಯನ್ನು ನಿಮ್ಮ ಆರೈಕೆದಾರ ಖಾತೆಗೆ ಜೋಡಿಸಬೇಕು.',
    privacyTitle: 'ನಿಮ್ಮ ಗೌಪ್ಯತೆ ಮತ್ತು ಸಮ್ಮತಿ',
    privacyBody: 'ವ್ಯಕ್ತಿಗತ ಮಾಹಿತಿ ಮತ್ತು ಆರೋಗ್ಯ ರೀಡಿಂಗ್‌ಗಳನ್ನು ನೀವು ಅನುಮೋದಿಸಿದ ಆರೈಕೆದಾರರೊಂದಿಗೆ ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.',
    consentTitle: 'ನಿಮ್ಮ ನಿಯಂತ್ರಣ',
    consentBody: 'ಯಾವ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಕೆಂದು ನೀವೇ ನಿರ್ಧರಿಸಬಹುದು. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ರದ್ದು ಮಾಡಬಹುದು.',
    shareHealthReadings: 'ಆರೋಗ್ಯ ರೀಡಿಂಗ್ ಹಂಚಿಕೊಳ್ಳಿ',
    shareCheckins: 'ದೈನಂದಿನ ಚೆಕ್-ಇನ್ ಹಂಚಿಕೊಳ್ಳಿ',
    revokeAccess: 'ಪ್ರವೇಶ ರದ್ದು ಮಾಡಿ',
    demoMode: 'ಡೆಮೋ ಮೋಡ್',
    demoNotice: 'ಡೆಮೋ ಮೋಡ್: ಕಾಲ್ಪನಿಕ ಬಳಕೆದಾರರು ಮತ್ತು ಕಾಲ್ಪನಿಕ ಮಾಹಿತಿ. ನೈಜ ರೋಗಿಗಳ ಮಾಹಿತಿಯಲ್ಲ.',
    demoSwitcherTitle: 'ಡೆಮೋ ಖಾತೆ ಬದಲಾಯಿಸಿ',
    resetDemoData: 'ಡೆಮೋ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ',
    exitDemo: 'ಡೆಮೋಯಿಂದ ನಿರ್ಗಮಿಸಿ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    language: 'ಭಾಷೆ',
    profile: 'ಪ್ರೊಫೈಲ್',
    missedCheckin: 'ಚೆಕ್-ಇನ್ ತಪ್ಪಿದೆ',
    missedCheckinNote: 'ಚೆಕ್-ಇನ್ ಮಾಡದಿರುವುದು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯ ಪುರಾವೆಯಲ್ಲ. ದಯವಿಟ್ಟು ಪ್ರೀತಿಯಿಂದ ಕರೆ ಮಾಡಿ ವಿಚಾರಿಸಿ.',
    checkInStatusOkay: 'ಕ್ಷೇಮವಾಗಿದ್ದಾರೆ',
    checkInStatusWantsCall: 'ಕರೆ ಬಯಸುತ್ತಾರೆ',
    checkInStatusNeedsHelp: 'ಸಹಾಯ ಬೇಕು',
    noCheckinYet: 'ಇಂದು ಇನ್ನೂ ಚೆಕ್-ಇನ್ ಇಲ್ಲ',
    timeAgo: 'ಹಿಂದೆ',
    justNow: 'ಈಗಷ್ಟೇ',
    minutesAgo: 'ನಿಮಿಷಗಳ ಹಿಂದೆ',
    hoursAgo: 'ಗಂಟೆಗಳ ಹಿಂದೆ',
    yesterday: 'ನಿನ್ನೆ',
    daysAgo: 'ದಿನಗಳ ಹಿಂದೆ',
    addHealthReading: 'ಆರೋಗ್ಯ ರೀಡಿಂಗ್ ಸೇರಿಸಿ',
    value: 'ಮೌಲ್ಯ',
    unit: 'ಘಟಕ',
    date: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
    notes: 'ಟಿಪ್ಪಣಿ (ಐಚ್ಛಿಕ)',
    type: 'ವಿಧ',
    title: 'ಶೀರ್ಷಿಕೆ',
    time: 'ಸಮಯ',
    recurrence: 'ಪುನರಾವರ್ತನೆ',
    daily: 'ದಿನನಿತ್ಯ',
    weekly: 'ವಾರಕ್ಕೊಮ್ಮೆ',
    once: 'ಒಮ್ಮೆ ಮಾತ್ರ',
    active: 'ಸಕ್ರಿಯ',
    inactive: 'ನಿಷ್ಕ್ರಿಯ',
    confirmHelpRequest: 'ಸಹಾಯದ ವಿನಂತಿ ದೃಢಪಡಿಸಿ',
    confirmHelpBody: 'ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ಈಗಲೇ ಸಹಾಯದ ವಿನಂತಿ ಕಳುಹಿಸಲು ನೀವು ಬಯಸುತ್ತೀರಾ?',
    confirmDeleteTitle: 'ಅಳಿಸುವಿಕೆಯನ್ನು ದೃಢಪಡಿಸಿ',
    confirmDeleteBody: 'ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    yes: 'ಹೌದು, ಕಳುಹಿಸಿ',
    no: 'ಇಲ್ಲ, ರದ್ದು ಮಾಡಿ',
    home: 'ಮುಖಪುಟ',
    chat: 'ಸಹಾಯಕ',
    health: 'ಆರೋಗ್ಯ',
    requests: 'ವಿನಂತಿಗಳು',
    invalidEmail: 'ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ.',
    invalidPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.',
    requiredField: 'ಈ ಮಾಹಿತಿ ಅಗತ್ಯವಾಗಿದೆ.',
    aiUnavailable: 'ಸಹಾಯಕ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆರೈಕೆದಾರರಿಗೆ ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ.',
    loginError: 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಪರಿಶೀಲಿಸಿ.',
    signupError: 'ಖಾತೆ ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    requestCreated: 'ನಿಮ್ಮ ಸಹಾಯದ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ.',
    checkinSaved: 'ನಿಮ್ಮ ಚೆಕ್-ಇನ್ ದಾಖಲಿಸಲಾಗಿದೆ.',
    readingSaved: 'ಆರೋಗ್ಯ ರೀಡಿಂಗ್ ಉಳಿಸಲಾಗಿದೆ.',
    reminderSaved: 'ಜ್ಞಾಪಕ ಉಳಿಸಲಾಗಿದೆ.',
    viewDetails: 'ವಿವರ ನೋಡಿ',
    requestedAt: 'ವಿನಂತಿಸಿದ ಸಮಯ',
    noRequestsYet: 'ಯಾವುದೇ ವಿನಂತಿಗಳಿಲ್ಲ.',
    requestFrom: 'ಇವರಿಂದ',
    requestTypeLabel: 'ವಿನಂತಿಯ ವಿಧ',
    requestStatusLabel: 'ಸ್ಥಿತಿ',
    requestSummaryLabel: 'ಸಾರಾಂಶ',
    requestDetails: 'ಸಹಾಯದ ವಿನಂತಿಯ ವಿವರಗಳು',
    caregiverFollowUp: 'ಆರೈಕೆದಾರರ ಟಿಪ್ಪಣಿ',
    welcomeTitle: 'ಕೇರ್‌ಕನೆಕ್ಟ್‌ಗೆ ಸ್ವಾಗತ',
    welcomeSubtitle: 'ಒಂಟಿಯಾಗಿ ವಾಸಿಸುವ ಹಿರಿಯರಿಗೆ ಸರಳ ದೈನಂದಿನ ಚೆಕ್-ಇನ್, ಔಷಧ ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ನಂಬಿಕಸ್ಥ ಆರೈಕೆಯ ಸಂಪರ್ಕ.',
    tryDemoMode: 'ಡೆಮೋ ಮೋಡ್ ಪ್ರಯತ್ನಿಸಿ',
    demoModeDesc: 'ಯಾವುದೇ ಸೈನ್-ಅಪ್ ಅಥವಾ ಡೇಟಾಬೇಸ್ ಇಲ್ಲದೆ ತಕ್ಷಣವೇ ಎಲ್ಲಾ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನುಭವಿಸಿ.',
    exploreAsSenior: 'ಹಿರಿಯ ವ್ಯಕ್ತಿಯಾಗಿ ನೋಡಿ (ಕಮಲಾ ದೇವಿ)',
    exploreAsCaregiver: 'ಆರೈಕೆದಾರರಾಗಿ ನೋಡಿ (ಪ್ರಿಯಾ ಶರ್ಮಾ)',
    supabaseStatusConnected: 'ಲೈವ್ ಸುಪಬೇಸ್ ಸಂಪರ್ಕಗೊಂಡಿದೆ',
    supabaseStatusDemoOnly: 'ಡೆಮೋ ಮೋಡ್ ಸಿದ್ಧವಾಗಿದೆ (ಸುಪಬೇಸ್ ಐಚ್ಛಿಕ)',
    supabaseSetupGuide: 'ಸುಪಬೇಸ್ ಸಂಪರ್ಕಿಸುವುದು ಹೇಗೆ',
    supabaseMissingNotice: 'ಲೈವ್ ಲಾಗಿನ್‌ಗೆ .env ನಲ್ಲಿ ಸುಪಬೇಸ್ ವಿವರಗಳು ಬೇಕು. ಈಗಲೇ ಪರೀಕ್ಷಿಸಲು ಮೇಲಿನ ಡೆಮೋ ಮೋಡ್ ಬಳಸಿ!',
    backToWelcome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    signInWithAccount: 'ಖಾತೆಯೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
    featureVoice: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಮತ್ತು ಚಾಟ್',
    featureCheckin: 'ಒಂದೇ ಸ್ಪರ್ಶದ ಕ್ಷೇಮ ವಿಚಾರಣೆ',
    featurePrivacy: 'ಗೌಪ್ಯತೆ-ಕೇಂದ್ರಿತ ಆರೈಕೆ',
  },
  ml: {
    appName: 'കെയർകണക്ട്',
    tagline: 'ദിനംതോറും പരിചരണ ബന്ധം',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    english: 'English',
    kannada: 'ಕನ್ನಡ',
    malayalam: 'മലയാളം',
    hindi: 'हिंदी',
    signIn: 'സൈൻ ഇൻ',
    signUp: 'ചേരുക',
    signOut: 'സൈൻ ഔട്ട്',
    email: 'ഇമെയിൽ',
    password: 'പാസ്‌വേഡ്',
    name: 'നിങ്ങളുടെ പേര്',
    iAmA: 'ഞാൻ ഒരു',
    senior: 'മുതിർന്ന വ്യക്തി',
    caregiver: 'പരിചരിക്കുന്ന ആൾ',
    createAccount: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
    alreadyHaveAccount: 'അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ ചെയ്യുക',
    dontHaveAccount: 'അക്കൗണ്ട് ഇല്ലേ? ചേരുക',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    error: 'എന്തോ തകരാർ സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.',
    success: 'വിജയം!',
    cancel: 'റദ്ദാക്കുക',
    save: 'സൂക്ഷിക്കുക',
    delete: 'നീക്കം ചെയ്യുക',
    edit: 'മാറ്റുക',
    close: 'അടയ്ക്കുക',
    back: 'പിന്നോട്ട്',
    next: 'അടുത്തത്',
    submit: 'സമർപ്പിക്കുക',
    confirm: 'സ്ഥിരീകരിക്കുക',
    iAmOkay: 'ഞാൻ സുഖമായിരിക്കുന്നു',
    iWantToTalk: 'എനിക്ക് സംസാരിക്കണം',
    iNeedHelp: 'എനിക്ക് സഹായം വേണം',
    letCaregiverKnowFine: 'നിങ്ങൾ സുഖമായിരിക്കുന്നു എന്ന് പരിചാരകനെ അറിയിക്കുക',
    requestCallFromCaregiver: 'പരിചാരകനിൽ നിന്ന് ഒരു കോൾ ആവശ്യപ്പെടുക',
    sendHelpRequestToCaregiver: 'പരിചാരകന് ഉടൻ സഹായ അഭ്യർത്ഥന അയക്കുക',
    todayReminders: 'ഇന്നത്തെ ഓർമ്മപ്പെടുത്തലുകൾ',
    contactTrustedPerson: 'വിശ്വസ്ത വ്യക്തിയെ ബന്ധപ്പെടുക',
    contactCaregiverDirectly: 'പരിചാരകനെ നേരിട്ട് ബന്ധപ്പെടുക',
    trustedContact: 'വിശ്വസ്ത കോൺടാക്റ്റ്',
    openDialer: 'ഫോൺ കോൾ ചെയ്യുക',
    goodMorning: 'സുപ്രഭാതം',
    goodAfternoon: 'ശുഭ ഉച്ചതിരിഞ്ഞ്',
    goodEvening: 'ശുഭ സന്ധ്യ',
    howAreYouToday: 'ഇന്ന് സുഖമാണോ?',
    assistant: 'പരിചരണ സഹായി',
    typeMessage: 'സന്ദേശം ടൈപ്പ് ചെയ്യുക...',
    send: 'അയക്കുക',
    speak: 'സംസാരിക്കാൻ അമർത്തുക',
    stopListening: 'നിർത്തുക',
    voiceNotSupported: 'ഈ ബ്രൗസറിൽ ശബ്ദ ഇൻപുട്ട് പിന്തുണയ്ക്കുന്നില്ല. ടൈപ്പ് ചെയ്യുക.',
    readAloud: 'വായിച്ചു കേൾപ്പിക്കുക',
    suggestedPrompts: 'നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ',
    explainReminder: 'എന്റെ ഓർമ്മപ്പെടുത്തൽ വിശദീകരിക്കുക',
    contactFamily: 'എന്റെ കുടുംബത്തെ ബന്ധപ്പെടുക',
    requestHelp: 'എനിക്ക് സഹായം വേണം',
    aiMedicalDisclaimer: 'ഈ സഹായി ഓർമ്മപ്പെടുത്തലുകളും പരിചരണ പിന്തുണയും നൽകുന്നു. ഇത് രോഗനിർണയം നടത്തുകയില്ല.',
    aiThinking: 'ചിന്തിക്കുന്നു...',
    healthReminders: 'ആരോഗ്യവും ഓർമ്മപ്പെടുത്തലുകളും',
    healthReadings: 'ആരോഗ്യ റീഡിംഗുകൾ',
    readingsTab: 'റീഡിംഗുകൾ',
    remindersTab: 'ഓർമ്മപ്പെടുത്തലുകൾ',
    addReading: 'റീഡിംഗ് ചേർക്കുക',
    editReading: 'റീഡിംഗ് മാറ്റുക',
    bloodPressure: 'രക്തസമ്മർദ്ദം',
    bloodGlucose: 'രക്തത്തിലെ പഞ്ചസാര',
    weight: 'തൂക്കം',
    temperature: 'താപനില',
    enteredByUser: 'ഞാൻ രേഖപ്പെടുത്തിയത്',
    enteredByCaregiver: 'പരിചാരകൻ രേഖപ്പെടുത്തിയത്',
    noReadings: 'റീഡിംഗുകൾ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല.',
    noReminders: 'ഓർമ്മപ്പെടുത്തലുകൾ ഒന്നും ചേർത്തിട്ടില്ല.',
    addReminder: 'ഓർമ്മപ്പെടുത്തൽ ചേർക്കുക',
    editReminder: 'ഓർമ്മപ്പെടുത്തൽ മാറ്റുക',
    medicine: 'മരുന്ന്',
    appointment: 'അപ്പോയിന്റ്മെന്റ്',
    dailyCheckin: 'പ്രതിദിന പരിശോധന',
    other: 'മറ്റുള്ളവ',
    manualEntryNotice: 'റീഡിംഗുകൾ സ്വയം രേഖപ്പെടുത്തിയതാണ്. ഈ ആപ്പ് രോഗനിർണയം നടത്തുന്നില്ല.',
    bpHelp: 'മാതൃക: സിസ്റ്റോളിക്/ഡയസ്റ്റോളിക് (ഉദാ. 120/80 mmHg)',
    glucoseHelp: 'മൂല്യം mg/dL ൽ (ഉദാ. 110)',
    helpRequests: 'സഹായ അഭ്യർത്ഥനകൾ',
    requestACall: 'കോൾ അഭ്യർത്ഥിക്കുക',
    askForAssistance: 'സഹായം ചോദിക്കുക',
    pending: 'തീർപ്പുകൽപ്പിച്ചിട്ടില്ല',
    acknowledged: 'അംഗീകരിച്ചു',
    handled: 'കൈകാര്യം ചെയ്തു',
    cancelRequest: 'അഭ്യർത്ഥന റദ്ദാക്കുക',
    emergencyDisclaimer: 'ഇതൊരു അടിയന്തര സേവനമല്ല. അടിയന്തര സാഹചര്യങ്ങളിൽ 112 ലേക്ക് വിളിക്കുക.',
    notAnEmergencyService: 'അടിയന്തര സേവനമല്ല',
    nationalEmergency: 'ദേശീയ അടിയന്തര നമ്പർ: 112',
    seniorHelpline: 'മുതിർന്ന പൗരന്മാരുടെ ഹെൽപ്പ്‌ലൈൻ: 14567',
    caregiverDashboard: 'പരിചാരക ഡാഷ്‌ബോർഡ്',
    linkedSeniors: 'പരിചരണത്തിലുള്ള മുതിർന്നവർ',
    allRequests: 'എല്ലാ അഭ്യർത്ഥനകളും',
    overview: 'അവലോകനം',
    latestCheckin: 'ഏറ്റവും പുതിയ ചെക്ക്-ഇൻ',
    pendingRequests: 'തീർപ്പുകൽപ്പിക്കാത്ത അഭ്യർത്ഥനകൾ',
    acknowledgeRequest: 'സ്വീകരിക്കുക',
    markHandled: 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തുക',
    noLinkedSeniors: 'മുതിർന്നവരെ ബന്ധിപ്പിച്ചിട്ടില്ല.',
    noLinkedSeniorsSub: 'മുതിർന്ന വ്യക്തികളുടെ അക്കൗണ്ട് നിങ്ങളുമായി ലിങ്ക് ചെയ്യേണ്ടതുണ്ട്.',
    privacyTitle: 'നിങ്ങളുടെ സ്വകാര്യത',
    privacyBody: 'നിങ്ങളുടെ വിവരങ്ങൾ നിങ്ങൾ അംഗീകരിച്ച പരിചാരകരുമായി മാത്രമേ പങ്കിടുകയുള്ളൂ.',
    consentTitle: 'നിങ്ങളുടെ നിയന്ത്രണം',
    consentBody: 'ഏതൊക്കെ വിവരങ്ങൾ പങ്കിടണമെന്ന് നിങ്ങൾ തീരുമാനിക്കുക. എപ്പോൾ വേണമെങ്കിലും മാറ്റാം.',
    shareHealthReadings: 'ആരോഗ്യ റീഡിംഗുകൾ പങ്കിടുക',
    shareCheckins: 'ചെക്ക്-ഇൻ പങ്കിടുക',
    revokeAccess: 'ആക്സസ് റദ്ദാക്കുക',
    demoMode: 'ഡെമോ മോഡ്',
    demoNotice: 'ഡെമോ മോഡ്: സാങ്കൽപ്പിക ഡാറ്റ. യഥാർത്ഥ രോഗിയുടെ വിവരങ്ങളല്ല.',
    demoSwitcherTitle: 'ഡെമോ അക്കൗണ്ട് മാറ്റുക',
    resetDemoData: 'ഡെമോ ഡാറ്റ പുനഃസജ്ജമാക്കുക',
    exitDemo: 'ഡെമോയിൽ നിന്ന് പുറത്തുകടക്കുക',
    settings: 'ക്രമീകരണങ്ങൾ',
    language: 'ഭാഷ',
    profile: 'പ്രൊഫൈൽ',
    missedCheckin: 'ചെക്ക്-ഇൻ ചെയ്തില്ല',
    missedCheckinNote: 'ചെക്ക്-ഇൻ ചെയ്യാതിരുന്നത് അത്യാഹിതത്തിന്റെ തെളിവല്ല. സ്നേഹത്തോടെ വിളിച്ച് അന്വേഷിക്കുക.',
    checkInStatusOkay: 'സുഖമായിരിക്കുന്നു',
    checkInStatusWantsCall: 'കോൾ വേണം',
    checkInStatusNeedsHelp: 'സഹായം വേണം',
    noCheckinYet: 'ഇന്ന് ചെക്ക്-ഇൻ ചെയ്തിട്ടില്ല',
    timeAgo: 'മുമ്പ്',
    justNow: 'ഇപ്പോൾ',
    minutesAgo: 'മിനിറ്റുകൾക്ക് മുമ്പ്',
    hoursAgo: 'മണിക്കൂറുകൾക്ക് മുമ്പ്',
    yesterday: 'ഇന്നലെ',
    daysAgo: 'ദിവസങ്ങൾക്ക് മുമ്പ്',
    addHealthReading: 'റീഡിംഗ് ചേർക്കുക',
    value: 'മൂല്യം',
    unit: 'യൂണിറ്റ്',
    date: 'തീയതിയും സമയവും',
    notes: 'കുറിപ്പുകൾ',
    type: 'തരം',
    title: 'തലക്കെട്ട്',
    time: 'സമയം',
    recurrence: 'ആവർത്തനം',
    daily: 'ദിവസേന',
    weekly: 'ആഴ്ചതോറും',
    once: 'ഒരു തവണ',
    active: 'സജീവം',
    inactive: 'നിഷ്ക്രിയം',
    confirmHelpRequest: 'സഹായ അഭ്യർത്ഥന സ്ഥിരീകരിക്കുക',
    confirmHelpBody: 'പരിചാരകന് ഇപ്പോൾ സഹായ അഭ്യർത്ഥന അയക്കാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുണ്ടോ?',
    confirmDeleteTitle: 'നീക്കം ചെയ്യൽ സ്ഥിരീകരിക്കുക',
    confirmDeleteBody: 'ഈ എൻട്രി നീക്കം ചെയ്യാൻ ഉറപ്പാണോ?',
    yes: 'അതെ, അയക്കുക',
    no: 'അല്ല, റദ്ദാക്കുക',
    home: 'ഹോം',
    chat: 'സഹായി',
    health: 'ആരോഗ്യം',
    requests: 'അഭ്യർത്ഥനകൾ',
    invalidEmail: 'സാധുവായ ഇമെയിൽ നൽകുക.',
    invalidPassword: 'പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം.',
    requiredField: 'ഈ ഫീൽഡ് ആവശ്യമാണ്.',
    aiUnavailable: 'സഹായി താൽക്കാലികമായി ലഭ്യമല്ല. പരിചാരകനെ നേരിട്ട് ബന്ധപ്പെടുക.',
    loginError: 'സൈൻ ഇൻ പരാജയപ്പെട്ടു. വിവരങ്ങൾ പരിശോധിക്കുക.',
    signupError: 'അക്കൗണ്ട് ഉണ്ടാക്കാൻ കഴിഞ്ഞില്ല.',
    requestCreated: 'സഹായ അഭ്യർത്ഥന അയച്ചു.',
    checkinSaved: 'ചെക്ക്-ഇൻ രേഖപ്പെടുത്തി.',
    readingSaved: 'റീഡിംഗ് സംരക്ഷിച്ചു.',
    reminderSaved: 'ഓർമ്മപ്പെടുത്തൽ സംരക്ഷിച്ചു.',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    requestedAt: 'അഭ്യർത്ഥിച്ച സമയം',
    noRequestsYet: 'അഭ്യർത്ഥനകൾ ഒന്നുമില്ല.',
    requestFrom: 'ആരിൽ നിന്ന്',
    requestTypeLabel: 'അഭ്യർത്ഥന തരം',
    requestStatusLabel: 'സ്ഥിതി',
    requestSummaryLabel: 'ചുരുക്കം',
    requestDetails: 'സഹായ അഭ്യർത്ഥന വിവരങ്ങൾ',
    caregiverFollowUp: 'പരിചാരക കുറിപ്പ്',
    welcomeTitle: 'കെയർകണക്റ്റിലേക്ക് സ്വാഗതം',
    welcomeSubtitle: 'തനിച്ചു താമസിക്കുന്ന മുതിർന്നവർക്ക് ലളിതമായ ദൈനംദിന ചെക്ക്-ഇൻ, മരുന്ന് ഓർമ്മപ്പെടുത്തലുകൾ, വിശ്വസ്ത പരിചരണം.',
    tryDemoMode: 'ഡെമോ മോഡ് പരീക്ഷിക്കുക',
    demoModeDesc: 'സജ്ജീകരണങ്ങളൊന്നുമില്ലാതെ എല്ലാ സവിശേഷതകളും ഉടൻ പരീക്ഷിക്കുക.',
    exploreAsSenior: 'മുതിർന്ന വ്യക്തിയായി കാണുക (കമല ദേവി)',
    exploreAsCaregiver: 'പരിചാരകനായി കാണുക (പ്രിയ ശർമ്മ)',
    supabaseStatusConnected: 'ലൈവ് സുപാബേസ് ബന്ധിപ്പിച്ചു',
    supabaseStatusDemoOnly: 'ഡെമോ മോഡ് തയ്യാറാണ് (സുപാബേസ് നിർബന്ധമല്ല)',
    supabaseSetupGuide: 'സുപാബേസ് എങ്ങനെ ബന്ധിപ്പിക്കാം',
    supabaseMissingNotice: 'ലൈവ് ലോഗിൻ ചെയ്യാൻ .env ഫയലിൽ സുപാബേസ് ആവശ്യമാണ്. ഇപ്പോൾ പരീക്ഷിക്കാൻ ഡെമോ മോഡ് ഉപയോഗിക്കുക!',
    backToWelcome: 'തിരികെ സ്വാഗതത്തിലേക്ക്',
    signInWithAccount: 'അക്കൗണ്ട് വഴി സൈൻ ഇൻ ചെയ്യുക',
    featureVoice: 'ബഹുഭാഷാ ശബ്ദവും ചാറ്റും',
    featureCheckin: 'ഒറ്റ സ്പർശന പരിശോധന',
    featurePrivacy: 'സ്വകാര്യത ഉറപ്പുള്ള പരിചരണം',
  },
  hi: {
    appName: 'केयरकनेक्ट',
    tagline: 'प्रतिदिन देखभाल का अपनापन',
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    kannada: 'ಕನ್ನಡ',
    malayalam: 'മലയാളം',
    hindi: 'हिंदी',
    signIn: 'साइन इन करें',
    signUp: 'साइन अप करें',
    signOut: 'साइन आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'आपका नाम',
    iAmA: 'मैं हूँ एक',
    senior: 'वरिष्ठ नागरिक',
    caregiver: 'देखभालकर्ता',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है? साइन इन करें',
    dontHaveAccount: 'खाता नहीं है? साइन अप करें',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हो गया। कृपया पुन: प्रयास करें।',
    success: 'सफलता!',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    back: 'वापस',
    next: 'आगे',
    submit: 'जमा करें',
    confirm: 'पुष्टि करें',
    iAmOkay: 'मैं ठीक हूँ',
    iWantToTalk: 'मैं बात करना चाहता हूँ',
    iNeedHelp: 'मुझे मदद चाहिए',
    letCaregiverKnowFine: 'अपने देखभालकर्ता को बताएं कि आप आज ठीक हैं',
    requestCallFromCaregiver: 'अपने देखभालकर्ता से कॉल का अनुरोध करें',
    sendHelpRequestToCaregiver: 'अपने देखभालकर्ता को तुरंत सहायता अनुरोध भेजें',
    todayReminders: 'आज के अनुस्मारक',
    contactTrustedPerson: 'विश्वसनीय व्यक्ति से संपर्क करें',
    contactCaregiverDirectly: 'देखभालकर्ता से सीधे संपर्क करें',
    trustedContact: 'विश्वसनीय संपर्क',
    openDialer: 'फ़ोन कॉल करें',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    howAreYouToday: 'आज आप कैसा महसूस कर रहे हैं?',
    assistant: 'केयर सहायक',
    typeMessage: 'अपना संदेश लिखें...',
    send: 'भेजें',
    speak: 'बोलने के लिए दबाएं',
    stopListening: 'रोकें',
    voiceNotSupported: 'इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है। कृपया टाइप करें।',
    readAloud: 'ज़ोर से पढ़ें',
    suggestedPrompts: 'सुझाए गए प्रश्न',
    explainReminder: 'मेरा अनुस्मारक समझाएं',
    contactFamily: 'परिवार से संपर्क करें',
    requestHelp: 'मुझे सहायता चाहिए',
    aiMedicalDisclaimer: 'यह सहायक अनुस्मारक और बातचीत में सहायता करता है। यह चिकित्सीय सलाह या निदान नहीं देता।',
    aiThinking: 'सोच रहा है...',
    healthReminders: 'स्वास्थ्य और अनुस्मारक',
    healthReadings: 'स्वास्थ्य रीडिंग',
    readingsTab: 'रीडिंग्स',
    remindersTab: 'अनुस्मारक',
    addReading: 'रीडिंग जोड़ें',
    editReading: 'रीडिंग बदलें',
    bloodPressure: 'रक्तचाप (BP)',
    bloodGlucose: 'रक्त शर्करा (शुगर)',
    weight: 'वज़न',
    temperature: 'तापमान',
    enteredByUser: 'मेरे द्वारा दर्ज',
    enteredByCaregiver: 'देखभालकर्ता द्वारा दर्ज',
    noReadings: 'अभी तक कोई रीडिंग दर्ज नहीं की गई।',
    noReminders: 'कोई अनुस्मारक निर्धारित नहीं है।',
    addReminder: 'अनुस्मारक जोड़ें',
    editReminder: 'अनुस्मारक बदलें',
    medicine: 'दवा',
    appointment: 'अपॉइंटमेंट',
    dailyCheckin: 'दैनिक चेक-इन',
    other: 'अन्य',
    manualEntryNotice: 'सभी रीडिंग हाथ से दर्ज की गई हैं। यह ऐप चिकित्सकीय माप नहीं करता।',
    bpHelp: 'प्रारूप: सिस्टोलिक/डायस्टोलिक (उदा. 120/80 mmHg)',
    glucoseHelp: 'मान mg/dL में (उदा. 110)',
    helpRequests: 'सहायता अनुरोध',
    requestACall: 'कॉल का अनुरोध करें',
    askForAssistance: 'सहायता मांगें',
    pending: 'लंबित',
    acknowledged: 'स्वीकार किया गया',
    handled: 'निपटाया गया',
    cancelRequest: 'अनुरोध रद्द करें',
    emergencyDisclaimer: 'यह ऐप आपातकालीन सेवा नहीं है। तत्काल सहायता के लिए 112 या किसी विश्वसनीय व्यक्ति को कॉल करें।',
    notAnEmergencyService: 'आपातकालीन सेवा नहीं',
    nationalEmergency: 'राष्ट्रीय आपातकालीन नंबर: 112',
    seniorHelpline: 'वरिष्ठ नागरिक हेल्पलाइन: 14567',
    caregiverDashboard: 'देखभालकर्ता डैशबोर्ड',
    linkedSeniors: 'जिनकी मैं देखभाल करता/करती हूँ',
    allRequests: 'सभी अनुरोध',
    overview: 'अवलोकन',
    latestCheckin: 'नवीनतम चेक-इन',
    pendingRequests: 'लंबित अनुरोध',
    acknowledgeRequest: 'अनुरोध स्वीकार करें',
    markHandled: 'निपटाया हुआ चिह्नित करें',
    noLinkedSeniors: 'अभी तक कोई वरिष्ठ नागरिक नहीं जोड़े।',
    noLinkedSeniorsSub: 'वरिष्ठ नागरिक के खाते को आपसे जोड़ना आवश्यक है।',
    privacyTitle: 'आपकी गोपनीयता और सहमति',
    privacyBody: 'आपकी व्यक्तिगत जानकारी केवल उन्हीं देखभालकर्ताओं के साथ साझा की जाती है जिन्हें आप मंज़ूरी देते हैं।',
    consentTitle: 'आपका नियंत्रण',
    consentBody: 'आप तय करते हैं कि कौन सी जानकारी साझा करनी है। इसे कभी भी बदला जा सकता है।',
    shareHealthReadings: 'स्वास्थ्य रीडिंग साझा करें',
    shareCheckins: 'दैनिक चेक-इन साझा करें',
    revokeAccess: 'पहुँच रद्द करें',
    demoMode: 'डेमो मोड',
    demoNotice: 'डेमो मोड: काल्पनिक उपयोगकर्ता और काल्पनिक डेटा। वास्तविक रोगी की जानकारी नहीं है।',
    demoSwitcherTitle: 'डेमो उपयोगकर्ता बदलें',
    resetDemoData: 'डेमो डेटा रीसेट करें',
    exitDemo: 'डेमो से बाहर निकलें',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    profile: 'प्रोफ़ाइल',
    missedCheckin: 'चेक-इन नहीं किया',
    missedCheckinNote: 'चेक-इन न करना आपातकाल का प्रमाण नहीं है। कृपया स्नेहपूर्वक कॉल करके कुशलक्षेम पूछें।',
    checkInStatusOkay: 'ठीक हैं',
    checkInStatusWantsCall: 'कॉल चाहते हैं',
    checkInStatusNeedsHelp: 'मदद चाहिए',
    noCheckinYet: 'आज अभी तक चेक-इन नहीं',
    timeAgo: 'पहले',
    justNow: 'अभी-अभी',
    minutesAgo: 'मिनट पहले',
    hoursAgo: 'घंटे पहले',
    yesterday: 'कल',
    daysAgo: 'दिन पहले',
    addHealthReading: 'स्वास्थ्य रीडिंग जोड़ें',
    value: 'मान',
    unit: 'इकाई',
    date: 'तारीख और समय',
    notes: 'टिप्पणी (वैकल्पिक)',
    type: 'प्रकार',
    title: 'शीर्षक',
    time: 'समय',
    recurrence: 'पुनरावृत्ति',
    daily: 'दैनिक',
    weekly: 'साप्ताहिक',
    once: 'केवल एक बार',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    confirmHelpRequest: 'सहायता अनुरोध की पुष्टि करें',
    confirmHelpBody: 'क्या आप अभी अपने देखभालकर्ता को सहायता अनुरोध भेजना चाहते हैं?',
    confirmDeleteTitle: 'हटाने की पुष्टि करें',
    confirmDeleteBody: 'क्या आप वाकई इस प्रविष्टि को हटाना चाहते हैं?',
    yes: 'हाँ, भेजें',
    no: 'नहीं, रद्द करें',
    home: 'होम',
    chat: 'सहायक',
    health: 'स्वास्थ्य',
    requests: 'अनुरोध',
    invalidEmail: 'कृपया मान्य ईमेल दर्ज करें।',
    invalidPassword: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    requiredField: 'यह जानकारी आवश्यक है।',
    aiUnavailable: 'सहायक अभी उपलब्ध नहीं है। कृपया देखभालकर्ता से सीधे संपर्क करें।',
    loginError: 'साइन इन विफल। कृपया विवरण जाँचें।',
    signupError: 'खाता बनाने में विफल। कृपया पुनः प्रयास करें।',
    requestCreated: 'आपका सहायता अनुरोध भेज दिया गया है।',
    checkinSaved: 'आपका चेक-इन दर्ज हो गया। धन्यवाद!',
    readingSaved: 'स्वास्थ्य रीडिंग सहेजी गई।',
    reminderSaved: 'अनुस्मारक सहेजा गया।',
    viewDetails: 'विवरण देखें',
    requestedAt: 'अनुरोध का समय',
    noRequestsYet: 'अभी तक कोई अनुरोध नहीं है।',
    requestFrom: 'की ओर से',
    requestTypeLabel: 'अनुरोध का प्रकार',
    requestStatusLabel: 'स्थिति',
    requestSummaryLabel: 'सारांश',
    requestDetails: 'सहायता अनुरोध विवरण',
    caregiverFollowUp: 'देखभालकर्ता की टिप्पणी',
    welcomeTitle: 'केयरकनेक्ट में आपका स्वागत है',
    welcomeSubtitle: 'अकेले रहने वाले वरिष्ठ नागरिकों के लिए सरल दैनिक चेक-इन, दवा अनुस्मारक और विश्वसनीय देखभाल का जुड़ाव।',
    tryDemoMode: 'डेमो मोड आज़माएं',
    demoModeDesc: 'बिना किसी सेटअप के सभी सुविधाओं का तुरंत अनुभव करें।',
    exploreAsSenior: 'वरिष्ठ नागरिक के रूप में देखें (कमला देवी)',
    exploreAsCaregiver: 'देखभालकर्ता के रूप में देखें (प्रिया शर्मा)',
    supabaseStatusConnected: 'लाइव सुपाबेस जुड़ा हुआ है',
    supabaseStatusDemoOnly: 'डेमो मोड तैयार है (सुपाबेस वैकल्पिक)',
    supabaseSetupGuide: 'सुपाबेस कैसे जोड़ें',
    supabaseMissingNotice: 'लाइव साइन-इन के लिए .env में सुपाबेस क्रेडेंशियल आवश्यक हैं। अभी जांचने के लिए ऊपर डेमो मोड का उपयोग करें!',
    backToWelcome: 'वापस स्वागत पृष्ठ पर जाएं',
    signInWithAccount: 'खाते से साइन इन करें',
    featureVoice: 'बहुभाषी आवाज़ और चैट',
    featureCheckin: 'एक स्पर्श में कुशलक्षेम चेक-इन',
    featurePrivacy: 'गोपनीयता-युक्त देखभाल समन्वय',
  },
};

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function getGreeting(lang: Language): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('goodMorning', lang);
  if (hour < 17) return t('goodAfternoon', lang);
  return t('goodEvening', lang);
}

export function formatTimeAgo(dateStr: string, lang: Language): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t('justNow', lang);
  if (diffMins < 60) return `${diffMins} ${t('minutesAgo', lang)}`;
  if (diffHours < 24) return `${diffHours} ${t('hoursAgo', lang)}`;
  if (diffDays === 1) return t('yesterday', lang);
  return `${diffDays} ${t('daysAgo', lang)}`;
}
