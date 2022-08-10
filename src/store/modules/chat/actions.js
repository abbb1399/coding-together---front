const axios = require('axios')

export default {
  // 채팅방 생성하기
  async createOrEnterRoom(context, roomInfo){
    
    try{
      const {data} = await axios.get(`${process.env.VUE_APP_API_URL}/checkroom/${roomInfo.roomId}`)
      
      if(data.length === 0){
        // 처음 만들때
        await axios.post(
          `${process.env.VUE_APP_API_URL}/chatroom`,
          roomInfo
        )
        context.commit('setIsRoomCreated', true)
      }else{
        // 방이 이미 있을때
        context.commit('setIsRoomCreated', false)
      }
    }catch(e){
      console.log(e)
    }
  },

  // 채팅방 입장하기
  async enterRoom(context, roomId){
    const token = context.rootGetters.token
    // console.log(roomId)
    // console.log(token)

    try{
      await axios.patch(
        `${process.env.VUE_APP_API_URL}/chatroom`,  
        {roomId},
        { headers: { Authorization: `Bearer ${token}` }}
      )

    }catch(e){
      console.log(e)
    }
  },


  // 채팅방 리스트 불러오기
  async fetchChatRoomList(context,pageNum){
    const token = context.rootGetters.token

    try{
      const {data} = await axios.get(
        `${process.env.VUE_APP_API_URL}/roomList/${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` }}
      )


      context.commit('setRoomList', data)
    }catch(e){
      console.log(e)
    }
  },

  // 입장한 방 정보 불러오기
  async fetchCurrentRoom(context,roomId){
    try{
      const {data} = await axios.get(
        `${process.env.VUE_APP_API_URL}/chatroom/${roomId}`
      )


      context.commit('setCurrentRoom', data)
    }catch(e){
      console.log(e)
    }
  },

  // 메세지 생성하기
  async registerMessage(context, msgData){
    try{
      const {data} = await axios.post(
        `${process.env.VUE_APP_API_URL}/chat-messages`, 
        msgData
      )   
      
      context.commit('setNewlyAddedMessage', data)
    }catch(e){
      console.log(e)
    } 
  },

  // 메세지 삭제하기
  async deleteMessage(_, msgId){
    try{
      await axios.patch(`${process.env.VUE_APP_API_URL}/delete-message/${msgId}`)

    }catch(e){
      console.log(e)
    }
  },

  // 메세지 수정하기
  async updateMessage(_, msgData){
    try{
      await axios.patch(`${process.env.VUE_APP_API_URL}/update-message`,msgData)
    }catch(e){
      console.log(e)
    }
  },

  // 메세지 불러오기 - 방 아이디 별로
  async fetchMessages(context, roomNum){
    try{
      const {data} = await axios.get(`${process.env.VUE_APP_API_URL}/chat-messages/${roomNum}`)

      context.commit('setMessages', data)
    }catch(e){
      console.log(e)
    }
  }
}