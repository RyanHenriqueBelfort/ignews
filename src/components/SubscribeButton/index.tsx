import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/axios';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps{
  priceId: string;
}
export function SubscribeButton({ priceId }: SubscribeButtonProps){
  const {data: session} = useSession()
  const router = useRouter()

  async function handleSubscribe(){
    if (!session) {
      signIn('github')
      return
    }

    if(session.activeSubscription){
      router.push('/posts')
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
      Inscreva-se agora
    </button>
  )
}