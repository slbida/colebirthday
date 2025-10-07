import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback values.')
}

export const supabase = createClient(
  supabaseUrl || 'https://ugihisumkgwgukymvrqs.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaWhpc3Vta2d3Z3VreW12cnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2OTEyMDAsImV4cCI6MjA3NTI2NzIwMH0.cafrjevpgh6zVJQkkg-GwJhTOoBlOeUspzW01m7vwag'
)

export type Message = {
  id: string
  name: string
  message: string
  created_at: string
}
