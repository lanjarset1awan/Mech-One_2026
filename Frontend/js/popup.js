function showPopup(message, isError = true) {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300';
        
        // Create popup card
        const card = document.createElement('div');
        card.className = 'bg-[#0a1d37]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl transform scale-95 opacity-0 transition-all duration-300 flex flex-col items-center text-center';
        
        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = `w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isError ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`;
        iconDiv.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check'} text-2xl"></i>`;
        
        // Title
        const title = document.createElement('h3');
        title.className = 'text-xl font-bold uppercase tracking-widest text-white mb-2';
        title.innerText = isError ? 'Error' : 'Success';
        
        // Message
        const msg = document.createElement('p');
        msg.className = 'text-gray-300 text-sm mb-6';
        msg.innerText = message;
        
        // Button
        const btn = document.createElement('button');
        btn.className = `w-full py-3 font-bold uppercase tracking-widest rounded-sm text-xs transition-colors ${isError ? 'bg-[#800000] hover:bg-red-700 text-white' : 'bg-[#ffcc00] hover:bg-yellow-400 text-[#0a1d37]'}`;
        btn.innerText = 'OK';
        
        btn.onclick = () => {
            overlay.classList.remove('opacity-100');
            card.classList.remove('scale-100', 'opacity-100');
            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve();
            }, 300);
        };
        
        card.appendChild(iconDiv);
        card.appendChild(title);
        card.appendChild(msg);
        card.appendChild(btn);
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        // Trigger animation
        requestAnimationFrame(() => {
            overlay.classList.add('opacity-100');
            card.classList.add('scale-100', 'opacity-100');
        });
    });
}
