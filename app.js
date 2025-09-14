// $(document).ready(function() {
//     // Initialize variables
//     let lastScrollPosition = 0;
//     let isRomanizationVisible = true;
//     const speakingUrl = getSpeak();
    
//     // Language mapping for speaking-url
//     const languageMap = {
//         'ru': 'russian',
//         'fa': 'persian',
//         'ar': 'arabic',
//         'he': 'hebrew',
//         'ja': 'japanese',
//         'ko': 'korean'
//     };
    
//     // Initialize UI
//     updatePasteClearButton();
    
//     // Event handlers
//     $('#original-text, #translation-text').on('input', function() {
//         processText();
//     });
    
//     $('#language-select').change(function() {
//         processText();
//     });
    
//     $('#paste-clear-btn').click(function() {
//         if ($('#original-text').val().trim() === '') {
//             pasteText();
//         } else {
//             clearField($('#original-text'));
//         }
//     });
    
//     $('#clear-screen-btn').click(function() {
//         clearField($('#original-text'));
//         clearField($('#translation-text'));
//         $('#original-output').empty();
//         $('#romanization-output').empty();
//         $('#translation-output').empty();
//         updatePasteClearButton();
//     });
    
//     $('#toggle-romanization-btn').click(function() {
//         isRomanizationVisible = !isRomanizationVisible;
//         $('#romanization-output').toggle();
//         $(this).find('i').toggleClass('fa-language fa-eye-slash');
//     });
    
//     // Scroll behavior for FABs
//     $(window).scroll(function() {
//         const currentScrollPosition = $(this).scrollTop();
//         if (currentScrollPosition > lastScrollPosition) {
//             // Scrolling down
//             $('.fab-btn').addClass('hidden');
//         } else {
//             // Scrolling up
//             $('.fab-btn').removeClass('hidden');
//         }
//         lastScrollPosition = currentScrollPosition;
//     });
    
//     // PWA installation prompt
//     window.addEventListener('beforeinstallprompt', (e) => {
//         e.preventDefault();
//         // You can store the event and show a custom install button later
//         console.log('PWA installation available');
//     });
    
//     // Service Worker Registration
//     if ('serviceWorker' in navigator) {
//         window.addEventListener('load', () => {
//             navigator.serviceWorker.register('sw.js').then(registration => {
//                 console.log('ServiceWorker registration successful');
//             }).catch(err => {
//                 console.log('ServiceWorker registration failed: ', err);
//             });
//         });
//     }
    
//     // Helper functions
//     function updatePasteClearButton() {
//         const btn = $('#paste-clear-btn');
//         if ($('#original-text').val().trim() === '') {
//             btn.html('<i class="fas fa-paste"></i> Paste');
//             btn.removeClass('btn-danger').addClass('btn-outline-secondary');
//         } else {
//             btn.html('<i class="fas fa-times"></i> Clear');
//             btn.removeClass('btn-outline-secondary').addClass('btn-danger');
//         }
//     }
    
//     function clearField(field) {
//         field.val('');
//         updatePasteClearButton();
//     }
    
//     async function pasteText() {
//         try {
//             const text = await navigator.clipboard.readText();
//             $('#original-text').val(text);
//             updatePasteClearButton();
//             processText();
//         } catch (err) {
//             console.error('Failed to read clipboard contents: ', err);
//             alert('Could not access clipboard. Please paste manually.');
//         }
//     }
    
//     function processText() {
//         const originalText = $('#original-text').val().trim();
//         const translationText = $('#translation-text').val().trim();
//         const languageCode = $('#language-select').val();
        
//         // Update translation output
//         $('#translation-output').text(translationText);
        
//         if (originalText === '') {
//             $('#original-output').empty();
//             $('#romanization-output').empty();
//             return;
//         }
        
//         // Process original text with romanization
//         $('#original-output').text(originalText);
        
//         if (languageMap[languageCode]) {
//             const romanizedText = romanizeText(originalText, languageMap[languageCode]);
//             $('#romanization-output').html(romanizedText);
//         } else {
//             $('#romanization-output').html('<p class="text-muted">Romanization not available for this language.</p>');
//         }
//     }
    
//     function romanizeText(text, lang) {
//         // Split into words (handling various scripts)
//         const words = text.split(/\s+/);
//         let output = '';
        
//         words.forEach(word => {
//             if (word.trim() === '') return;
            
//             // Romanize using speaking-url
//             let romanized = speakingUrl.slugify(word, {
//                 lang: lang,
//                 separator: ' ',
//                 maintainCase: false,
//                 titleCase: false,
//                 uric: false,
//                 mark: false
//             }).replace(/-/g, ' ');
            
//             // Create word block
//             output += `
//                 <div class="word-block">
//                     <span class="word-original">${word}</span>
//                     <span class="word-romanized">${romanized}</span>
//                 </div>
//             `;
//         });
        
//         return output;
//     }
// });




class LanguageLearningPWA {
    constructor() {
        this.isRomanizationVisible = true;
        this.lastScrollTop = 0;
        this.initializeApp();
        this.bindEvents();
        this.registerServiceWorker();
    }

    initializeApp() {
        console.log('LinguaFlow PWA Initialized');
    }

    bindEvents() {
        // Text input events
        $('#originalText').on('input', () => this.handleTextInput());
        $('#translationText').on('input', () => this.renderOutput());
        
        // Smart button functionality
        $('#smartButton').on('click', () => this.handleSmartButton());
        
        // Language selection
        $('#languageSelect').on('change', () => this.handleLanguageChange());
        
        // FAB events
        $('#clearScreen').on('click', () => this.clearAll());
        $('#toggleRomanization').on('click', () => this.toggleRomanization());
        
        // Scroll behavior for FABs
        $(window).on('scroll', () => this.handleScroll());
        
        // Initialize smart button state
        this.updateSmartButton();
    }

    handleTextInput() {
        this.updateSmartButton();
        this.renderOutput();
    }

    updateSmartButton() {
        const originalText = $('#originalText').val().trim();
        const $button = $('#smartButton');
        
        if (originalText) {
            $button.text('Clear').removeClass('btn-primary').addClass('btn-outline-danger');
        } else {
            $button.text('Paste').removeClass('btn-outline-danger').addClass('btn-primary');
        }
    }

    async handleSmartButton() {
        const $button = $('#smartButton');
        const originalText = $('#originalText').val().trim();
        
        if (originalText) {
            // Clear functionality
            $('#originalText').val('');
            this.updateSmartButton();
            this.renderOutput();
        } else {
            // Paste functionality
            try {
                $button.html('<span class="loading"></span>');
                const text = await navigator.clipboard.readText();
                $('#originalText').val(text);
                this.updateSmartButton();
                this.renderOutput();
            } catch (err) {
                console.warn('Clipboard access failed:', err);
                // Fallback: focus on textarea for manual paste
                $('#originalText').focus();
            } finally {
                $button.text('Clear').removeClass('btn-primary').addClass('btn-outline-danger');
            }
        }
    }

    handleLanguageChange() {
        this.renderOutput();
    }

    renderOutput() {
        const originalText = $('#originalText').val().trim();
        const translationText = $('#translationText').val().trim();
        const $output = $('#outputSection');

        if (!originalText && !translationText) {
            $output.html(`
                <div class="empty-state">
                    <i class="bi bi-chat-dots"></i>
                    <p>Your romanized text will appear here...</p>
                </div>
            `);
            return;
        }

        // Break down texts into paragraphs
        const originalParagraphs = this.breakIntoParagraphs(originalText);
        const translationParagraphs = this.breakIntoParagraphs(translationText);

        // Render paragraph by paragraph
        let outputHtml = '<div class="fade-in">';
        outputHtml += this.renderParagraphs(originalParagraphs, translationParagraphs);
        outputHtml += '</div>';
        
        $output.html(outputHtml);
    }

    breakIntoParagraphs(text) {
        if (!text) return [];
        
        // Split by double line breaks (paragraph breaks)
        return text.split(/\n\s*\n/)
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0);
    }

    renderParagraphs(originalParagraphs, translationParagraphs) {
        const maxParagraphs = Math.max(originalParagraphs.length, translationParagraphs.length);
        let output = '';

        for (let i = 0; i < maxParagraphs; i++) {
            output += `<div class="paragraph-block" data-paragraph="${i + 1}">`;

            // First render translation paragraph (if exists)
            if (i < translationParagraphs.length && translationParagraphs[i]) {
                output += `
                    <div class="translation-paragraph">
                        <div class="paragraph-header">
                            <i class="bi bi-translate me-2"></i>
                            <span class="paragraph-number">Paragraph ${i + 1} - English</span>
                        </div>
                        <div class="translation-content">
                            ${this.escapeHtml(translationParagraphs[i])}
                        </div>
                    </div>
                `;
            }

            // Then render original language paragraph with romanization (if exists)
            if (i < originalParagraphs.length && originalParagraphs[i]) {
                const selectedLanguage = $('#languageSelect').val();
                output += `
                    <div class="original-paragraph">
                        <div class="paragraph-header">
                            <i class="bi bi-book me-2"></i>
                            <span class="paragraph-number">Paragraph ${i + 1} - ${this.getLanguageName(selectedLanguage)}</span>
                        </div>
                        <div class="original-content">
                            ${this.processTextWithRomanization(originalParagraphs[i])}
                        </div>
                    </div>
                `;
            }

            output += '</div>';
        }

        return output;
    }

    getLanguageName(code) {
        const languageNames = {
            'ru': 'Russian',
            'ar': 'Arabic',
            'fa': 'Persian',
            'he': 'Hebrew',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'hi': 'Hindi',
            'ur': 'Urdu',
            'th': 'Thai',
            'vi': 'Vietnamese'
        };
        return languageNames[code] || 'Original Language';
    }

    processTextWithRomanization(text) {
        const selectedLanguage = $('#languageSelect').val();
        
        // Split text into sentences first
        const sentences = text.split(/([.!?]+\s*)/).filter(s => s.trim());
        let result = '';

        for (let i = 0; i < sentences.length; i += 2) {
            const sentence = sentences[i];
            const punctuation = sentences[i + 1] || '';
            
            if (sentence && sentence.trim()) {
                result += '<div class="sentence-container">';
                
                // Process words in the sentence
                const words = sentence.split(/\s+/);
                words.forEach((word, wordIndex) => {
                    if (word.trim()) {
                        const romanized = this.romanizeWord(word, selectedLanguage);
                        result += `
                            <span class="word-container" data-word="${wordIndex}">
                                <span class="original-word">${this.escapeHtml(word)}</span>
                                <span class="romanized-word ${this.isRomanizationVisible ? '' : 'hidden'}">${this.escapeHtml(romanized)}</span>
                            </span>
                        `;
                        
                        // Add space if not the last word
                        if (wordIndex < words.length - 1) {
                            result += ' ';
                        }
                    }
                });
                
                // Add punctuation
                if (punctuation.trim()) {
                    result += `<span class="punctuation">${this.escapeHtml(punctuation)}</span>`;
                }
                
                result += '</div>';
            }
        }

        return result;
    }

    romanizeWord(word, language) {
        try {
            // Clean the word of punctuation for romanization
            const cleanWord = word.replace(/[^\p{L}\p{N}]/gu, '');
            if (!cleanWord) return word;

            // Use speaking-url library if available
            if (typeof getSlug !== 'undefined') {
                const romanized = getSlug(cleanWord, {
                    lang: language,
                    separator: '',
                    maintainCase: false,
                    custom: this.getCustomMappings(language)
                });

                return romanized || this.basicTransliterate(cleanWord);
            } else {
                return this.basicTransliterate(cleanWord);
            }
        } catch (error) {
            console.warn('Romanization failed for word:', word, error);
            return this.basicTransliterate(word);
        }
    }

    getCustomMappings(language) {
        const mappings = {
            'ru': {
                'ё': 'yo', 'ъ': '', 'ь': ''
            },
            'ar': {
                'ث': 'th', 'خ': 'kh', 'ذ': 'dh', 'ش': 'sh', 'غ': 'gh'
            },
            'fa': {
                'ژ': 'zh', 'چ': 'ch', 'گ': 'g', 'پ': 'p', 'ک': 'k'
            }
        };
        
        return mappings[language] || {};
    }

    basicTransliterate(word) {
        // Enhanced transliteration map
        const transliterationMap = {
            // Cyrillic
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e',
            'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
            'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
            'э': 'e', 'ю': 'yu', 'я': 'ya',
            
            // Arabic/Persian/Urdu
            'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
            'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
            'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
            'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ک': 'k', 'گ': 'g', 'ل': 'l',
            'م': 'm', 'ن': 'n', 'و': 'w', 'ه': 'h', 'ی': 'y', 'پ': 'p',
            'چ': 'ch', 'ژ': 'zh',
            
            // Hindi/Devanagari basics
            'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
            'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'क': 'ka', 'ख': 'kha',
            'ग': 'ga', 'घ': 'gha', 'च': 'cha', 'छ': 'chha', 'ज': 'ja',
            'झ': 'jha', 'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha',
            'न': 'na', 'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha',
            'म': 'ma', 'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
            'श': 'sha', 'स': 'sa', 'ह': 'ha'
        };

        return word.split('').map(char => {
            const lower = char.toLowerCase();
            return transliterationMap[lower] || char;
        }).join('');
    }

    toggleRomanization() {
        this.isRomanizationVisible = !this.isRomanizationVisible;
        const $romanizedWords = $('.romanized-word');
        const $toggleBtn = $('#toggleRomanization i');

        if (this.isRomanizationVisible) {
            $romanizedWords.removeClass('hidden');
            $toggleBtn.removeClass('bi-eye-slash').addClass('bi-eye');
        } else {
            $romanizedWords.addClass('hidden');
            $toggleBtn.removeClass('bi-eye').addClass('bi-eye-slash');
        }
    }

    clearAll() {
        $('#originalText').val('');
        $('#translationText').val('');
        this.updateSmartButton();
        this.renderOutput();
    }

    handleScroll() {
        const scrollTop = $(window).scrollTop();
        const $fabContainer = $('#fabContainer');

        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            // Scrolling down
            $fabContainer.addClass('hidden');
        } else {
            // Scrolling up
            $fabContainer.removeClass('hidden');
        }

        this.lastScrollTop = scrollTop;
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the app when DOM is ready
$(document).ready(() => {
    new LanguageLearningPWA();
});