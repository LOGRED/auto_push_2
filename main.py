import win32gui
import win32con
import win32api
import time
import win32com.client
import win32clipboard

def find_window_by_title(title):
    def callback(hwnd, hwnds):
        if win32gui.IsWindowVisible(hwnd) and win32gui.GetWindowText(hwnd):
            if title in win32gui.GetWindowText(hwnd):
                hwnds.append(hwnd)
        return True
    hwnds = []
    win32gui.EnumWindows(callback, hwnds)
    return hwnds[0] if hwnds else None

def click_in_window(hwnd, relative_x, relative_y):
    if not hwnd:
        return False
    
    rect = win32gui.GetWindowRect(hwnd)
    left, top, right, bottom = rect
    
    abs_x = left + relative_x
    abs_y = top + relative_y
    
    win32gui.SetForegroundWindow(hwnd)
    time.sleep(0.1)
    
    win32api.SetCursorPos((abs_x, abs_y))
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)
    return True

def type_text(text):
    shell = win32com.client.Dispatch("WScript.Shell")
    shell.SendKeys(text)
    win32api.keybd_event(win32con.VK_RETURN, 0)
    win32api.keybd_event(win32con.VK_RETURN, 0, win32con.KEYEVENTF_KEYUP)

def main():
    hwnd = find_window_by_title("Chrome")
    if not hwnd:
        print("Chrome 창을 찾을 수 없습니다. Chrome을 먼저 실행해주세요.")
        return
        
    click_in_window(hwnd, 100, 50)
    time.sleep(0.5)
    
    win32api.keybd_event(win32con.VK_CONTROL, 0)
    win32api.keybd_event(ord('L'), 0)
    win32api.keybd_event(ord('L'), 0, win32con.KEYEVENTF_KEYUP)
    win32api.keybd_event(win32con.VK_CONTROL, 0, win32con.KEYEVENTF_KEYUP)
    time.sleep(0.1)
    
    type_text("www.naver.com")
    time.sleep(1)

if __name__ == "__main__":
    main()