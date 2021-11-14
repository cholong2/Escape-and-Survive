## 🏃‍♀️ Computer graphics term project - Escape Rooom 🏃‍ 
***
컴퓨터 그래픽스 텀프로젝트입니다. WebGL, threejs 라이브러리를 사용했습니다.    
1인칭 방탈출게임으로 문제를 풀고 장애물을 피하며 방에서 탈출해야합니다.

### Contents
> [Breif decription](https://github.com/cholong2/Escape-and-Survive/blob/main/README.md#breif-description)  
> [Key features](https://github.com/cholong2/Escape-and-Survive/blob/main/README.md#key-features)  
> [Implementation details](https://github.com/cholong2/Escape-and-Survive/blob/main/README.md#implementation-details)  
> [team members](https://github.com/cholong2/Escape-and-Survive/blob/main/README.md#team-members) 

# Breif description
![image](https://user-images.githubusercontent.com/80766477/141669140-ba57e068-6d31-4790-b54a-19150fcd3918.png)

**첫번째방**은 단서를 클릭해 문제를 푸는 방입니다.  
문제를 순차적으로 풀어나가야 하고 모든 문제를 다 풀게 되면 다음방으로 갈 수 있게 됩니다.

![image](https://user-images.githubusercontent.com/80766477/141669207-8b6eaa94-cb4a-4c0e-bb2e-364b9755d9ef.png)

**두번째방**은 장애물을 피해 나가야합니다.  
빨간 기둥에 닿게 되면 화면 하단에 있는 하트가 깎이게 되고 모두 깎이게 된다면 처음부터 다시 시작해야합니다.


![image](https://user-images.githubusercontent.com/80766477/141669414-8634bac7-b3b0-4ebf-987d-f91113e9f90e.png)

**세번째방**은 맞춤법 문제를 푸는 방입니다.
두 개의 단어중에서 맞는 쪽으로 가야합니다. 만약 틀렸다면 하트가 깎이고 이전 위치로 돌아갑니다.
시간안에 모든 정답을 맞췄다면 마지막 보물상자에 도착하게 되고 클릭시 게임이 종료됩니다.

# Key features
![image](https://user-images.githubusercontent.com/80766477/141669631-ec53b092-256e-40b5-925e-5efbac8258f3.png)


# Implementation details
### Click event
![image](https://user-images.githubusercontent.com/80766477/141670211-92b08795-2083-4164-8b6e-ef9f34dd8155.png)
- gltf를 클릭했을 때 문제 오브젝트 생성
- 전구를 클릭했을 때 light 추가
- 문을 클릭했을 때 애니메이션 시작
- 상자를 클릭했을 때 새로운 html 로드

### Collision detection
![image](https://user-images.githubusercontent.com/80766477/141669970-815979a6-c8b9-49a1-81da-7825b846a7f1.png)
- 설정한 범위 내로 플레이어 이동 제한
- 모든 문제를 풀 때까지 이동 제한
- 장애물과 부딪혔을 때 플레이어 하트 감소

### Life function (player life limit)
![image](https://user-images.githubusercontent.com/80766477/141670029-5b05d6ba-7c5c-4ed4-b057-3944e7910ed1.png)
- 플레이어의 하트가 모두 깎인다면 처음 위치에서 재시작
- 남은 하트는 플레이어 화면 하단에 보여줌

### Time limit
![image](https://user-images.githubusercontent.com/80766477/141670078-1cb3d5cc-05ea-4c2b-a6cf-d00883b42b0d.png)
- 제한된 시간 내에 탈출하지 못할 시 미션 실패 페이지 로드
- Let's try again 버튼을 누르면 재도전 가능

### Others
![image](https://user-images.githubusercontent.com/80766477/141670126-25a3ec3e-bfd5-4304-bf03-06ead58b8fcd.png)
- 백그라운드 음악 재생
- 플레이어 1인칭 시점으로 카메라 위치 조정
- 조명, 그림자 구현 

# team members
박초롱 
김현민 
윤채현 
최지안 
