/**
 * Skypay — built-in configuration fallback.
 *
 * Environment variables ALWAYS win. This file only exists so the app keeps
 * working when the `.env` file is missing (for example after downloading the
 * project as a ZIP from GitHub, or on a host where the variables were not
 * filled in yet).
 *
 * Only public/project-level values live here:
 *   - the Supabase project URL + anon (publishable) key, which are meant to be
 *     visible in the browser anyway and are protected by row level security;
 *   - the SMS provider settings, which are read on the server only.
 *
 * To point the app at a different Supabase project or SMS account, set the
 * environment variables — no code change needed.
 */

export const APP_CONFIG = {
  supabaseUrl: 'https://dmqiauxksjspxwtvdcdx.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtcWlhdXhrc2pzcHh3dHZkY2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDc5OTAsImV4cCI6MjEwMzg4Mzk5MH0.NEhF7zRlaUMgGbhDY08y2WyMDSttd0G6xcytBA-SG6A',
  smsApiUrl:
    'https://bulkblaster-biotp-api-290441563653.asia-south1.run.app/send-otp',
  smsApiKey: 'bb_IwPnQGFEvLpInaB7Mz6cE1rTcYUARdVe',
  smsBrandName: 'Skypay',
  smsSenderId: 'DASSAM',
} as const;
