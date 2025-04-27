function sendMessage() {
    const input = document.getElementById("messageInput");
    const messageText = input.value.trim();
  
    if (messageText !== "") {
      const chatMessages = document.getElementById("chat-messages");
  
      // Membuat elemen pesan
      const messageElement = document.createElement("div");
      messageElement.className = "message";
      messageElement.innerHTML = `<span class="sender">You:</span> ${messageText}`;
  
      // Menambahkan pesan ke dalam kotak chat
      chatMessages.appendChild(messageElement);
  
      // Scroll otomatis ke bawah
      chatMessages.scrollTop = chatMessages.scrollHeight;
  
      // Kosongkan input setelah mengirim
      input.value = "";
    }
  }
  
  // Kirim pesan dengan tekan tombol Enter
  document.getElementById("messageInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
  
  // Camera functionality
  let stream = null;
  let facingMode = "user";
  let isLandscape = false;

  function openCamera() {
    const modal = document.getElementById("cameraModal");
    modal.style.display = "block";
    startCamera();
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
  }

  function closeCamera() {
    const modal = document.getElementById("cameraModal");
    modal.style.display = "none";
    stopCamera();
    window.removeEventListener('resize', updateOrientation);
    window.removeEventListener('orientationchange', updateOrientation);
  }

  function updateOrientation() {
    const video = document.getElementById("cameraPreview");
    const container = document.querySelector('.camera-container');
    isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
        container.style.maxWidth = '80vh';
        video.style.transform = 'none';
    } else {
        container.style.maxWidth = '100%';
        // Adjust video rotation based on device orientation
        const orientation = window.orientation;
        if (orientation === 90) {
            video.style.transform = 'rotate(90deg)';
        } else if (orientation === -90) {
            video.style.transform = 'rotate(-90deg)';
        } else {
            video.style.transform = 'none';
        }
    }
  }

  async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: facingMode,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        };

        // Adjust constraints based on orientation
        if (isLandscape) {
            constraints.video.width = { ideal: 1920 };
            constraints.video.height = { ideal: 1080 };
        } else {
            constraints.video.width = { ideal: 1080 };
            constraints.video.height = { ideal: 1920 };
        }

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = document.getElementById("cameraPreview");
        video.srcObject = stream;
        
        // Wait for video to be ready
        video.onloadedmetadata = () => {
            updateOrientation();
        };
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.");
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  function switchCamera() {
    facingMode = facingMode === "user" ? "environment" : "user";
    stopCamera();
    startCamera();
  }

  function takePhoto() {
    const video = document.getElementById("cameraPreview");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    
    // Convert to blob and create URL
    canvas.toBlob(blob => {
      const imageUrl = URL.createObjectURL(blob);
      // Here you can save the photo or do something with it
      console.log("Photo taken:", imageUrl);
    }, "image/jpeg");
  }

  function openGallery() {
    // Implement gallery functionality here
    console.log("Opening gallery...");
  }
  
  // Account Creation
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createAccountForm');
    const profilePicture = document.getElementById('profilePicture');
    const profilePreview = document.getElementById('profilePreview');

    // Preview profile picture
    profilePicture.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const fullName = document.getElementById('fullName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const bio = document.getElementById('bio').value;
        const profilePicture = document.getElementById('profilePicture').files[0];

        // Validate password
        if (password !== confirmPassword) {
            alert('Password tidak cocok!');
            return;
        }

        // Create account object
        const account = {
            fullName,
            username,
            email,
            password,
            bio,
            profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : null
        };

        // Save account to localStorage (for demo purposes)
        localStorage.setItem('userAccount', JSON.stringify(account));

        // Show success message
        alert('Akun berhasil dibuat!');
        
        // Redirect to profile page
        window.location.href = 'profile.html';
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;

        // Check length
        if (password.length >= 8) strength++;
        
        // Check for numbers
        if (/\d/.test(password)) strength++;
        
        // Check for special characters
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        // Check for uppercase and lowercase
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

        // Update UI based on strength
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        let strengthText = '';
        let strengthColor = '';
        
        switch(strength) {
            case 0:
            case 1:
                strengthText = 'Lemah';
                strengthColor = '#ff4444';
                break;
            case 2:
                strengthText = 'Sedang';
                strengthColor = '#ffbb33';
                break;
            case 3:
                strengthText = 'Kuat';
                strengthColor = '#00C851';
                break;
            case 4:
                strengthText = 'Sangat Kuat';
                strengthColor = '#007E33';
                break;
        }

        strengthIndicator.style.color = strengthColor;
        strengthIndicator.textContent = `Kekuatan Password: ${strengthText}`;
        
        // Remove existing indicator if any
        const existingIndicator = document.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Add new indicator
        passwordInput.parentNode.appendChild(strengthIndicator);
    });
  });
  
  // Profile Display and Edit
  function loadProfile() {
    const account = JSON.parse(localStorage.getItem('userAccount'));
    if (account) {
        // Update profile display
        document.getElementById('profileName').textContent = account.fullName;
        document.getElementById('profileUsername').textContent = `@${account.username}`;
        document.getElementById('profileBio').textContent = account.bio || 'Belum ada bio';
        
        if (account.profilePicture) {
            document.getElementById('profilePictureDisplay').src = account.profilePicture;
        }

        // Hide create account form and show profile
        document.querySelector('.create-account-section').style.display = 'none';
        document.querySelector('.profile-display-section').style.display = 'block';
    } else {
        // Show create account form if no account exists
        document.querySelector('.create-account-section').style.display = 'block';
        document.querySelector('.profile-display-section').style.display = 'none';
    }
  }

  function editProfile() {
    const account = JSON.parse(localStorage.getItem('userAccount'));
    if (account) {
        // Fill form with existing data
        document.getElementById('fullName').value = account.fullName;
        document.getElementById('username').value = account.username;
        document.getElementById('email').value = account.email;
        document.getElementById('bio').value = account.bio || '';
        
        // Show create account form and hide profile
        document.querySelector('.create-account-section').style.display = 'block';
        document.querySelector('.profile-display-section').style.display = 'none';
    }
  }

  // Update form submission to handle both new and existing accounts
  document.getElementById('createAccountForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const bio = document.getElementById('bio').value;
    const profilePicture = document.getElementById('profilePicture').files[0];

    // Validate password if it's a new account
    if (!localStorage.getItem('userAccount') && password !== confirmPassword) {
        alert('Password tidak cocok!');
        return;
    }

    // Create or update account object
    const account = {
        fullName,
        username,
        email,
        bio,
        profilePicture: profilePicture ? URL.createObjectURL(profilePicture) : 
                      JSON.parse(localStorage.getItem('userAccount'))?.profilePicture || null
    };

    // Only update password if it's a new account
    if (!localStorage.getItem('userAccount')) {
        account.password = password;
    }

    // Save account to localStorage
    localStorage.setItem('userAccount', JSON.stringify(account));

    // Show success message
    alert('Profil berhasil diperbarui!');
    
    // Reload profile display
    loadProfile();
  });

  // Load profile when page loads
  document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
  });
  
  // Post Creation and Display
  let currentMedia = null;
  let currentLocation = null;

  function loadUserProfile() {
    const account = JSON.parse(localStorage.getItem('userAccount'));
    if (account && account.profilePicture) {
        document.getElementById('userProfilePicture').src = account.profilePicture;
    }
  }

  function openImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentMedia = {
                    type: 'image',
                    url: e.target.result
                };
                showMediaPreview();
            }
            reader.readAsDataURL(file);
        }
    };
    input.click();
  }

  function openVideoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            currentMedia = {
                type: 'video',
                url: url
            };
            showMediaPreview();
        }
    };
    input.click();
  }

  function showMediaPreview() {
    const preview = document.getElementById('mediaPreview');
    const imagePreview = document.getElementById('imagePreview');
    const videoPreview = document.getElementById('videoPreview');

    if (currentMedia) {
        preview.style.display = 'block';
        if (currentMedia.type === 'image') {
            imagePreview.src = currentMedia.url;
            imagePreview.style.display = 'block';
            videoPreview.style.display = 'none';
        } else {
            videoPreview.src = currentMedia.url;
            videoPreview.style.display = 'block';
            imagePreview.style.display = 'none';
        }
    } else {
        preview.style.display = 'none';
    }
  }

  function removeMedia() {
    currentMedia = null;
    showMediaPreview();
  }

  function addLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Using OpenStreetMap Nominatim for reverse geocoding
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(response => response.json())
                .then(data => {
                    currentLocation = {
                        lat: lat,
                        lng: lng,
                        address: data.display_name
                    };
                    showLocation();
                });
        });
    } else {
        alert('Geolocation tidak didukung di browser ini');
    }
  }

  function showLocation() {
    const locationTag = document.getElementById('locationTag');
    const locationText = document.getElementById('locationText');
    
    if (currentLocation) {
        locationText.textContent = currentLocation.address;
        locationTag.style.display = 'flex';
    } else {
        locationTag.style.display = 'none';
    }
  }

  function removeLocation() {
    currentLocation = null;
    showLocation();
  }

  function createPost() {
    const content = document.getElementById('postContent').value.trim();
    if (!content && !currentMedia) {
        alert('Silakan tambahkan teks atau media untuk postingan');
        return;
    }

    const account = JSON.parse(localStorage.getItem('userAccount'));
    if (!account) {
        alert('Silakan login terlebih dahulu');
        return;
    }

    const post = {
        id: Date.now(),
        author: {
            name: account.fullName,
            username: account.username,
            profilePicture: account.profilePicture
        },
        content: content,
        media: currentMedia,
        location: currentLocation,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    // Save post to localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear form
    document.getElementById('postContent').value = '';
    currentMedia = null;
    currentLocation = null;
    showMediaPreview();
    showLocation();

    // Refresh posts feed
    loadPosts();
  }

  function loadPosts() {
    const postsFeed = document.getElementById('postsFeed');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
    
    postsFeed.innerHTML = posts.map(post => `
        <div class="post" data-id="${post.id}">
            <div class="post-header">
                <img src="${post.author.profilePicture}" alt="Profil">
                <div class="post-info">
                    <h3>${post.author.name}</h3>
                    <span>${formatTime(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.media ? `
                    ${post.media.type === 'image' ? 
                        `<img src="${post.media.url}" alt="Post">` : 
                        `<video controls><source src="${post.media.url}" type="video/mp4"></video>`
                    }
                ` : ''}
                ${post.location ? `
                    <div class="location-tag">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${post.location.address}</span>
                    </div>
                ` : ''}
            </div>
            <div class="post-actions">
                <button onclick="likePost(${post.id})" class="like-btn${likedPosts.includes(post.id) ? ' liked' : ''}">
                    <i class="far fa-heart"></i> Suka <span class="like-count">${post.likes}</span>
                </button>
                <button onclick="commentPost(${post.id})">
                    <i class="far fa-comment"></i> Komentar
                </button>
                <button onclick="sharePost(${post.id})">
                    <i class="far fa-share-square"></i> Bagikan
                </button>
            </div>
        </div>
    `).join('');
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return 'Baru saja';
  }

  function likePost(postId) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Cek apakah user sudah like (gunakan localStorage per user)
    let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
    const alreadyLiked = likedPosts.includes(postId);

    if (alreadyLiked) {
        // Jika sudah like, batalkan like
        post.likes = Math.max(0, post.likes - 1);
        likedPosts = likedPosts.filter(id => id !== postId);
    } else {
        // Jika belum, tambahkan like
        post.likes++;
        likedPosts.push(postId);
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    loadPosts();
  }

  function commentPost(postId) {
    const comment = prompt('Tulis komentar Anda:');
    if (comment) {
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(p => p.id === postId);
        if (post) {
            const account = JSON.parse(localStorage.getItem('userAccount'));
            post.comments.push({
                author: {
                    name: account.fullName,
                    username: account.username,
                    profilePicture: account.profilePicture
                },
                content: comment,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('posts', JSON.stringify(posts));
            loadPosts();
        }
    }
  }

  function sharePost(postId) {
    const post = JSON.parse(localStorage.getItem('posts')).find(p => p.id === postId);
    if (post) {
        const shareUrl = `${window.location.origin}/post.html?id=${postId}`;
        alert(`Bagikan tautan ini: ${shareUrl}`);
    }
  }

  // Initialize posts page
  document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadPosts();
  });
  
  // Chat Functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Chat List
    const chatItems = document.querySelectorAll('.chat-item');
    const chatWindow = document.querySelector('.chat-window');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const removeAttachment = document.getElementById('removeAttachment');
    const chatInfoModal = document.getElementById('chatInfoModal');
    const closeModal = document.querySelector('.close-btn');
    const chatSearch = document.getElementById('chatSearch');

    // Chat Search
    chatSearch.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        chatItems.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Select Chat
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            chatItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            // Show chat window
            chatWindow.classList.add('active');
            // Load chat messages
            loadChatMessages(this.dataset.userId);
        });
    });

    // Send Message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message || fileInput.files.length > 0) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'sent');
            
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.type.startsWith('image/')) {
                    messageElement.innerHTML = `
                        <img src="${URL.createObjectURL(file)}" alt="Attachment">
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    `;
                } else if (file.type.startsWith('video/')) {
                    messageElement.innerHTML = `
                        <video controls>
                            <source src="${URL.createObjectURL(file)}" type="${file.type}">
                        </video>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    `;
                }
            } else {
                messageElement.innerHTML = `
                    <p>${message}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                `;
            }
            
            chatMessages.appendChild(messageElement);
            messageInput.value = '';
            fileInput.value = '';
            filePreview.style.display = 'none';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Send button click
    sendButton.addEventListener('click', sendMessage);

    // Enter key press
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // File Input
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                filePreview.style.display = 'block';
                if (file.type.startsWith('image/')) {
                    filePreview.innerHTML = `
                        <img src="${URL.createObjectURL(file)}" alt="Preview">
                        <button id="removeAttachment" class="remove-attachment">×</button>
                    `;
                } else {
                    filePreview.innerHTML = `
                        <video controls>
                            <source src="${URL.createObjectURL(file)}" type="${file.type}">
                        </video>
                        <button id="removeAttachment" class="remove-attachment">×</button>
                    `;
                }
            }
        }
    });

    // Remove Attachment
    document.addEventListener('click', function(e) {
        if (e.target.id === 'removeAttachment') {
            fileInput.value = '';
            filePreview.style.display = 'none';
        }
    });

    // Chat Info Modal
    document.querySelector('.chat-actions button:last-child').addEventListener('click', function() {
        chatInfoModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        chatInfoModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === chatInfoModal) {
            chatInfoModal.style.display = 'none';
        }
    });

    // Load Chat Messages (Simulated)
    function loadChatMessages(userId) {
        chatMessages.innerHTML = '';
        // Simulated messages
        const messages = [
            {
                type: 'received',
                content: 'Halo! Apa kabar?',
                time: '10:00'
            },
            {
                type: 'sent',
                content: 'Baik, terima kasih!',
                time: '10:01'
            },
            {
                type: 'received',
                content: 'Ada yang bisa saya bantu?',
                time: '10:02'
            }
        ];

        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', msg.type);
            messageElement.innerHTML = `
                <p>${msg.content}</p>
                <span class="message-time">${msg.time}</span>
            `;
            chatMessages.appendChild(messageElement);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
  