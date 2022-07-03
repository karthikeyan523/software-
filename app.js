const auth = firebase.auth()
const db = firebase.firestore()
const loginForm = document.querySelectorAll('.login-signup')[0]

const signupForm = document.querySelectorAll('.login-signup')[1]

const nav_to_signup = document.querySelector('#nav-to-signup')

const nav_to_login = document.querySelector('#nav-to-login')

const login_submit = document.querySelector('#login-submit')

const signup_submit = document.querySelector('#signup-submit')

const forgotpwd = document.querySelector('.forgot-pwd')

const button_display = document.querySelector('.butn')

const details = document.querySelector('.user-details')

const onepage = document.querySelector('.exit')

const nav_to_exit = document.querySelector('#nav-to-exit')

// const temp_disp = document.querySelector('./hum')


const userDetails = id => {
    onepage.style.display = 'none'
    window.localStorage.setItem('currently_loggedIn',id)
    const docRef = db.collection('users').doc(id)
    docRef.get().then(doc => {
        if(doc.exists){
            const h1 = details.children[0]
            h1.textContent = `Welcome ${doc.data().userName}`
            const signout = details.children[1]
            details.style.display = 'block'
            onepage.style.display = 'none'
            
        
            signout.addEventListener('click' , () => {
                auth.signOut().then(() => {
                    window.localStorage.removeItem('currently_loggedIn')
                    details.style.display = 'none'
                    loginForm.style.display = 'block'
                    onepage.style.display = 'none'
                }).catch(() => {
                    console.log('Error Occurred While Sign Out')
                })
            })
        } else {
            console.log(`No such Document`)
        }
    }).catch(err => {
        console.log(`Error getting document : ${err}`)
    })
}
window.onload = () => {
    try{
        const currentUser = window.localStorage.getItem('currently_loggedIn')
        if(currentUser === null){
            throw new Error('No Current User')
        } else {
            userDetails(currentUser)
        }
    }catch(err){
        loginForm.style.display = 'block'
        onepage.style.display = 'none'
    }
}



nav_to_signup.addEventListener('click' , () => {
    loginForm.style.display = 'none'
    signupForm.style.display = 'block'
    button_display.style.display = 'none'
    onepage.style.display = 'none'
    document.querySelector('#login').reset()
})

nav_to_login.addEventListener('click' , () => {
    loginForm.style.display = 'block'
    signupForm.style.display = 'none'
    button_display.style.display = 'none'
    onepage.style.display = 'none'
    document.querySelector('#signup').reset()
})
nav_to_exit.addEventListener('click' , () => {
    loginForm.style.display = 'block'
    signupForm.style.display = 'none'

    button_display.style.display = 'none'
    onepage.style.display = 'none'
    document.querySelector('#signup').reset()
    document.querySelectorAll('.loader')[0].style.display = 'none'
})



signup_submit.addEventListener('click' , event => {
    event.preventDefault()
    signup_submit.style.display = 'none'
    button_display.style.display = 'none'
    onepage.style.display = 'none'
    document.querySelectorAll('.loader')[1].style.display = 'block'
    const userName = document.querySelector('#signup-username').value 
    const email = document.querySelector('#signup-email').value 
    const password = document.querySelector('#signup-pwd').value 
    auth.createUserWithEmailAndPassword(email,password).then(cred => {
        swal({
            title : 'Account Created Successfully',
            icon : 'success'
        }).then(() => {
            db.collection('users').doc(cred.user.uid).set({
                userName : userName,
                email : email
            }).then(() => {
            signup_submit.style.display = 'block'
            document.querySelectorAll('.loader')[1].style.display = 'none'
            document.querySelector('#signup').reset()
            signupForm.style.display = 'none'
            loginForm.style.display = 'block'
            onepage.style.display = 'none'
        }).catch(err => {
            swal({
                title : err,
                icon : 'error'
            }).then(() => {
                signup_submit.style.display = 'block'
                onepage.style.display = 'none'
                document.querySelectorAll('.loader')[1].style.display = 'none'
            })
        })
    })
    }).catch(err => {
        swal({
            title : err,
            icon : 'error'
        }).then(() => {
            signup_submit.style.display = 'block'
            onepage.style.display = 'none'
            document.querySelectorAll('.loader')[1].style.display = 'none'
        })
    })
})


login_submit.addEventListener('click' , event => {
    event.preventDefault()
    login_submit.style.display = 'none'
    onepage.style.display = 'none'
    document.querySelectorAll('.loader')[0].style.display = 'block'
    const email = document.querySelector('#login-email').value 
    const password = document.querySelector('#login-pwd').value 
    auth.signInWithEmailAndPassword(email,password).then(cred => {
        swal({
            title : 'Login Success',
            icon : 'success'
        }).then(() => {
            login_submit.style.display = 'block'
            document.querySelectorAll('.loader')[0].style.display = 'block'
            document.querySelector('#login').reset()
            loginForm.style.display = 'none'
            userDetails(cred.user.uid)
        })
        .then(() => {
            button_display.style.display = 'block'
            onepage.style.display = 'block'
            document.querySelectorAll('.loader')[0].style.display = 'block'
            
        })
    }).catch(err => {
        swal({
            title : err ,
            icon :'error'
        }).then(() => {
            login_submit.style.display = 'block'
            document.querySelectorAll('.loader')[0].style.display = 'none'
            
        })
    })
})

forgotpwd.addEventListener('click' , () => {
    swal({
        title : 'Reset Password',
        content : {
            element : 'input',
            attributes : {
                placeholder : 'Type your Email',
                type : 'email'
            }
        }
    }).then(val => {
        login_submit.style.display = 'none'
        onepage.style.display = 'none'
        document.querySelectorAll('.loader')[0].style.display = 'block'
        auth.sendPasswordResetEmail(val).then(() => {
            swal({
                title : 'Check Your Email',
                icon : 'success'
            }).then(() => {
                login_submit.style.display = 'block'
                onepage.style.display = 'none'
                document.querySelectorAll('.loader')[0].style.display = 'none'
            })
        }).catch(err => {
            swal({
                title : err,
                icon : 'error'
            }).then(() => {
                login_submit.style.display = 'block'
                onepage.style.display = 'none'
                document.querySelectorAll('.loader')[0].style.display = 'none'
            })
        })
    })
})

// butn.addEventListener('click',()=>{

// }
// )
// function onclick(event){
//     // document.getElementById('butn').style.display = '';
//      event.preventDefault();
// }
// const form = document.getElementById('butn');
// form.addEventListener('submit', onclick);
