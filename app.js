        let musicRequests = JSON.parse(localStorage.getItem('musicRequests')) || [];

        function switchTab(tabName) {
            // 탭 버튼 활성화 상태 변경
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');

            // 탭 내용 표시/숨김
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            if (tabName === 'request') {
                document.getElementById('requestTab').classList.add('active');
            } else if (tabName === 'list') {
                document.getElementById('listTab').classList.add('active');
                displayRequests();
            }
        }

        function updateStats() {
            const today = new Date().toDateString();
            const todayRequests = musicRequests.filter(req => 
                new Date(req.timestamp).toDateString() === today
            ).length;

            document.getElementById('totalRequests').textContent = musicRequests.length;
            document.getElementById('todayRequests').textContent = todayRequests;
        }

        function displayRequests() {
            const requestsList = document.getElementById('requestsList');
            
            if (musicRequests.length === 0) {
                requestsList.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3>🎵</h3>
                        <p>아직 신청된 노래가 없습니다.<br>첫 번째 신청자가 되어보세요!</p>
                    </div>
                `;
                return;
            }

            // 최신 순으로 정렬
            const sortedRequests = [...musicRequests].reverse();
            
            requestsList.innerHTML = sortedRequests.map((request, index) => `
                <div class="request-item">
                    <div class="request-header">
                        <div class="song-title">${request.songTitle}</div>
                        <div class="timestamp">${formatDate(request.timestamp)}
                            <button class="delete-btn" onclick="deleteRequest(${musicRequests.length - 1 - index})">삭제</button>
                        </div>
                    </div>
                    <div class="song-artist">🎤 ${request.artist}</div>
                    <div class="requester">
                        👤 ${request.studentName || '익명'} (${request.grade} ${request.className})
                        ${request.genre ? `| 🎼 ${request.genre}` : ''}
                    </div>
                    ${request.message ? `<div style="margin-top: 8px; font-style: italic; color: #555;">💬 "${request.message}"</div>` : ''}
                </div>
            `).join('');
        }

        function deleteRequest(index) {
            if (confirm('이 신청을 삭제하시겠습니까?')) {
                musicRequests.splice(index, 1);
                localStorage.setItem('musicRequests', JSON.stringify(musicRequests));
                displayRequests();
                updateStats();
            }
        }

        function formatDate(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            
            if (diffInMinutes < 1) {
                return '방금 전';
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes}분 전`;
            } else if (diffInMinutes < 1440) {
                return `${Math.floor(diffInMinutes / 60)}시간 전`;
            } else {
                return date.toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }

        // 폼 제출 처리
        document.getElementById('musicRequestForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const request = {
                songTitle: formData.get('songTitle'),
                artist: formData.get('artist'),
                grade: formData.get('grade'),
                className: formData.get('className'),
                studentName: formData.get('studentName'),
                genre: formData.get('genre'),
                message: formData.get('message'),
                timestamp: new Date().toISOString()
            };
            
            musicRequests.push(request);
            localStorage.setItem('musicRequests', JSON.stringify(musicRequests));
            
            // 성공 메시지 표시
            document.getElementById('successMessage').style.display = 'block';
            
            // 폼 리셋
            this.reset();
            
            // 통계 업데이트
            updateStats();
            
            // 3초 후 성공 메시지 숨김
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 3000);
        });

        // 페이지 로드시 통계 업데이트
        updateStats();
