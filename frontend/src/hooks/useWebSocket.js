import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const useWebSocket = (onNotification) => {
  const clientRef = useRef(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/notifications', (message) => {
          const notification = JSON.parse(message.body)
          if (onNotification) onNotification(notification)
        })
      }
    })
    client.activate()
    clientRef.current = client
    return () => client.deactivate()
  }, [])

  return clientRef
}

export default useWebSocket