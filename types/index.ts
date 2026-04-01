export type UserRole = 'user' | 'admin'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled'
export type SubscriptionPlan = 'monthly' | 'yearly'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type PaymentStatus = 'pending' | 'paid'
export type DrawStatus = 'pending' | 'published'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan | null
  subscription_end_date: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  charity_id: string | null
  charity_percentage: number
  created_at: string
}

export interface Charity {
  id: string
  name: string
  description: string
  image_url: string | null
  website: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface Score {
  id: string
  user_id: string
  score: number
  played_at: string
  created_at: string
}

export interface Draw {
  id: string
  draw_date: string
  drawn_numbers: number[]
  jackpot_amount: number
  pool_4match: number
  pool_3match: number
  status: DrawStatus
  jackpot_rolled_over: boolean
  created_at: string
}

export interface DrawEntry {
  id: string
  draw_id: string
  user_id: string
  numbers: number[]
  match_count: number
  created_at: string
}

export interface Winner {
  id: string
  draw_id: string
  user_id: string
  match_type: '5-match' | '4-match' | '3-match'
  prize_amount: number
  proof_url: string | null
  verification_status: VerificationStatus
  payment_status: PaymentStatus
  created_at: string
}