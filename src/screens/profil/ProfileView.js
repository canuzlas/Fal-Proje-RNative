import * as React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl, Linking } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import BackIcon from 'react-native-vector-icons/Ionicons';
import SettingsIcon from 'react-native-vector-icons/AntDesign';
import PencilIcon from 'react-native-vector-icons/FontAwesome5';
import DiamondIcon from 'react-native-vector-icons/FontAwesome';
import UserIcon from 'react-native-vector-icons/EvilIcons';



class ProfileView extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         userLogged: true,
         pageLoading: true,
         user: null,
         UserLoggedAt: null,
         loop: 0,
         refresh: false
      }
   }
   componentDidMount = async () => {
      this.setState({ loop: this.state.loop++ })
   }
   componentDidUpdate = async (prevProps, prevState) => {

      if (prevState.loop != this.state.loop) {

         const User = JSON.parse(await AsyncStorage.getItem('User'))
         const UserLoggedAt = await AsyncStorage.getItem('UserLoggedAt')

         if (User === null) {
            this.setState({ pageLoading: false, userLogged: false, loop: this.state.loop++, refresh: false })
         } else {
            this.setState({ pageLoading: false, userLogged: true, user: User, UserLoggedAt: UserLoggedAt, loop: this.state.loop, refresh: false })
         }
      }
   }
   componentWillUnmount = async () => {
      this.setState = (state, callback) => {
         return;
      };
   }

   goToLoginPage() {
      this.props.navigation.navigate('Login', { alertInfo: "thanLogin" })
   }
   signOutGoogle = async () => {
      await GoogleSignin.configure({
         webClientId: '232744567398-fclqsccnqab64tr6m727l69mpr7cmio8.apps.googleusercontent.com'
      });
      await GoogleSignin.signOut();
      await AsyncStorage.clear();
      this.props.navigation.navigate('Tab')
      this.setState({ user: null, loop: this.state.loop++ })
   }
   signOutEmailPhone = async () => {
      await AsyncStorage.setItem("User", "")
      await AsyncStorage.setItem("UserLoggedAt", "")
      this.props.navigation.navigate('Tab')
      this.setState({ user: null, loop: this.state.loop++ })
   }

   refreshPage = async () => {
      this.setState({ refresh: true })
      const User = JSON.parse(await AsyncStorage.getItem('User'))
      const UserLoggedAt = await AsyncStorage.getItem('UserLoggedAt')
      console.log(User)
      if (User === null) {
         this.setState({ pageLoading: false, userLogged: false, loop: this.state.loop++, refresh: false })
      } else {
         this.setState({ pageLoading: false, userLogged: true, user: User, UserLoggedAt: UserLoggedAt, loop: this.state.loop, refresh: false })
      }
   }
   render() {
      return (
         this.state.pageLoading ?
            <View style={styles.pageLoadingContainer}>
               <Image style={styles.pageLoadingImage} source={require('../../assets/loading/loading.gif')} />
               <Text style={styles.pageLoadingText}>sayfa yükleniyor..</Text>
            </View>
            :
            this.state.userLogged ?
               // this.state.UserLoggedAt === 'google' ?
               <ScrollView refreshControl={<RefreshControl onRefresh={() => this.refreshPage()} refreshing={this.state.refresh}></RefreshControl>} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
                  <View style={styles.profileContainer}>
                     <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}><BackIcon name='chevron-back-outline' size={35} color={'#ffa31a'} /></TouchableOpacity>
                        <TouchableOpacity style={styles.settingsButton} onPress={() => this.props.navigation.navigate("Settings")}><SettingsIcon name='setting' size={35} color={'#ffa31a'} /></TouchableOpacity>
                     </View>
                     <View style={styles.body}>
                        <View style={styles.profile}>
                           <View style={styles.profilePhotoView}>
                              <Image style={styles.profilePhoto} resizeMode='stretch' source={this.state.user.photo != 'false' ? { uri: 'http://10.0.2.2:3000/' + this.state.user.photo } : require('../../assets/arascreengif/gif.gif')} />
                           </View>
                           <Text style={styles.profileName}>{this.state.user.name}</Text>
                           <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile')} style={styles.profilePencilIcon}><PencilIcon name='pencil-alt' size={20} color={'#ffa31a'} /></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={()=>Linking.openURL('https://www.bynogame.com/tr/destekle/mcanuzlas')}>
                           <View style={styles.supportToDeveloper}>
                              <DiamondIcon style={styles.supportIcon} name='diamond' color={'#ffa31a'} size={30} />
                              <Text style={styles.supporText}>Geliştiriciyi destekle</Text>
                              <SettingsIcon style={styles.supportRightIcon} name='arrowright' color={'white'} size={20} />
                           </View>
                        </TouchableOpacity>
                        <View style={styles.istatistik}>
                           <Text style={styles.istatistikTitle}>Neler yaptım?</Text>
                           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                              <View style={styles.istatistikCoffeeView}>
                                 <Text style={{ color: 'white', alignSelf: 'center' }}>Kahve Falı</Text>
                                 <Text style={{ color: '#ffa31a', alignSelf: 'center' }}>3</Text>
                              </View>
                              <View style={styles.istatistikTarotView}>
                                 <Text style={{ color: 'white', alignSelf: 'center' }}>Tarot Falı</Text>
                                 <Text style={{ color: '#ffa31a', alignSelf: 'center' }}>4</Text>
                              </View>
                           </View>
                        </View>
                        <View style={styles.puanlama}>
                           <SettingsIcon style={styles.supportIcon} name='star' color={'#ffa31a'} size={30} />
                           <Text style={styles.supporText}>Bizi puanlayın</Text>
                           <SettingsIcon style={styles.supportRightIcon} name='arrowright' color={'white'} size={20} />
                        </View>
                     </View>
                  </View>
               </ScrollView >
               :
               <View style={styles.containerNotLogged}>
                  <Text style={styles.notLoggedText}>Kullanıcı Giriş Yapmadı.!</Text>
                  <TouchableOpacity style={styles.notLoggedButton} onPress={() => this.goToLoginPage()}><Text style={styles.notLoggedButtonText}>Giriş Yap</Text></TouchableOpacity>
               </View>
      )
   }

}


export default () => {
   const navigation = useNavigation()

   return (
      <SafeAreaView>
         <ProfileView navigation={navigation}></ProfileView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   //pageloading styles
   pageLoadingContainer: { width: '100%', height: '100%', justifyContent: 'center', backgroundColor: 'black' },
   pageLoadingImage: { width: 150, height: 150, alignSelf: 'center' },
   pageLoadingText: { color: 'white', fontSize: 20, fontWeight: '600', alignSelf: 'center' },

   //profile
   profileContainer: { backgroundColor: 'black', width: '100%', height: '100%' },
   header: { alignItems: 'center', justifyContent: 'center', padding: 20, flexDirection: 'row' },
   backButton: { position: 'absolute', left: 15, top: 15 },
   settingsButton: { position: 'absolute', right: 15, top: 15 },

   body: { justifyContent: 'center', padding: 20 },

   //profile photo vb.
   profile: { flexDirection: 'row', padding: 20, justifyContent: 'center', alignItems: 'center' },
   profilePhotoView: { justifyContent: 'center', position: 'absolute', top: 15, left: 15, width: 80, height: 80, backgroundColor: 'black', borderRadius: 50 },
   profilePhoto: { width: '100%', height: '100%', alignSelf: 'center', borderRadius: 100 },
   profileName: { color: 'white', alignSelf: 'center', fontSize: 25, top: 15 },
   profilePencilIcon: { position: 'absolute', right: 25, top: 40, alignSelf: 'center' },

   //supportDeveloper
   supportToDeveloper: { justifyContent: 'center', padding: 20, flexDirection: 'row', width: '100%', height: 70, backgroundColor: '#0f0f0f', marginTop: 60 },
   supportIcon: { position: 'absolute', left: 20, alignSelf: 'center' },
   supporText: { color: 'white', alignSelf: 'center', position: 'absolute', left: 70, fontSize: 18 },
   supportRightIcon: { alignSelf: 'center', position: 'absolute', right: 20 },

   //istatistik
   istatistik: { width: '100%', padding: 20, backgroundColor: '#0f0f0f', marginTop: 20 },
   istatistikTitle: { color: 'white', fontWeight: '700', fontSize: 20 },
   istatistikCoffeeView: { width: '45%', height: 50, alignSelf: 'center', justifyContent: 'center', backgroundColor: 'black' },
   istatistikTarotView: { width: '45%', height: 50, alignSelf: 'center', justifyContent: 'center', backgroundColor: 'black' },

   // puan
   puanlama: { justifyContent: 'center', padding: 20, flexDirection: 'row', width: '100%', height: 70, backgroundColor: '#0f0f0f', marginTop: 20 },


   containerNotLogged: { backgroundColor: 'black', width: '100%', height: '100%', justifyContent: 'center' },
   notLoggedText: { color: 'white', fontSize: 20, alignSelf: 'center' },
   notLoggedButton: { marginTop: 50, borderRadius: 5, backgroundColor: '#ffa31a', padding: 10, width: '80%', alignSelf: 'center', justifyContent: 'center' },
   notLoggedButtonText: { fontSize: 18, alignSelf: 'center', color: 'black', fontWeight: '500' }
})