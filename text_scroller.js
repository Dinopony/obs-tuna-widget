/**
 * A class used for scrolling text being cut (typically by an "overflow: hidden" CSS property). 
 */
class TextScroller {
    constructor($text, $container, allowScrolling) {
        this.$text = $text;
        this.$container = $container;
        this.excessSize = 0;
        this.currentScroll = 0;
        this.reverseScrollDirection = false;
        this.waitingTime = 0;
        this.allowScrolling = allowScrolling;

        this.computeExcessSize();
    }

    setText(newText) {
        if(this.$text.textContent != newText) {
            this.$text.textContent = newText;
            // Text changed, reset some properties
            this.$text.style.marginLeft = "0px";
            this.currentScroll = 0;
            this.reverseScrollDirection = false;
            this.computeExcessSize();
        }
    }

    setInError() {
        this.$text.style.color = "red";
        this.$text.textContent = "???";
    }

    computeExcessSize() {
        this.excessSize = 40 + this.$text.scrollWidth - this.$container.offsetWidth;
        if(this.excessSize < 20) {
            // Don't scroll if text is barely eaten
            this.excessSize = 0;
        }
        if(this.excessSize > 0) {
            this.addWaitingTime();
        }
    }

    addWaitingTime() {
        this.waitingTime = 1000;
    }

    update(tickDuration) {
        if(this.waitingTime > 0) {
            this.waitingTime -= tickDuration;
            return;
        }

        if(this.excessSize <= 0 || !this.allowScrolling) {
            return;
        }

        if(!this.reverseScrollDirection) {
            if(this.currentScroll < this.excessSize) {
                this.currentScroll += 1;
            } else {
                this.reverseScrollDirection = true;
                this.addWaitingTime();
            }
        } else {
            if(this.currentScroll > 0) {
                this.currentScroll -= 1;
            } else {
                this.reverseScrollDirection = false;
                this.addWaitingTime();
            }    
        }

        this.$text.style.marginLeft = `-${this.currentScroll}px`;
    }
}