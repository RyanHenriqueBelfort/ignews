import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/axios';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps{
  priceId: string;
}
export function SubscribeButton({ priceId }: SubscribeButtonProps){
  const {data: session} = useSession()

  async function handleSubscribe(){
    if (!session) {
      signIn('github')
      return
    }

    try {
      const response = api.post('/subscribe')

      const { sessionId } = (await response).data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({sessionId})
    } catch (error) {
      alert(error.message)
    }
    // Criação da checkout
  }
  return(
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}