#!/usr/bin/env python3
"""
Docker Management Menu for Banking Application
"""
import os
import subprocess
import sys

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if os.name == 'nt' else 'clear')

def run_command(command, description):
    """Run a shell command and display output"""
    print(f"\n{'='*60}")
    print(f"Executing: {description}")
    print(f"{'='*60}\n")
    
    try:
        if isinstance(command, list):
            result = subprocess.run(command, shell=True, check=False)
        else:
            result = subprocess.run(command, shell=True, check=False)
        
        if result.returncode != 0:
            print(f"\n⚠️  Command exited with code {result.returncode}")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    
    input("\nPress Enter to continue...")

def docker_start():
    """Start all Docker containers"""
    print(f"\n{'='*60}")
    print(f"Executing: Starting all services")
    print(f"{'='*60}\n")
    
    try:
        # Start services
        result = subprocess.run("docker-compose up -d", shell=True, check=False)
        
        if result.returncode == 0:
            print("\n⏳ Waiting for services to be ready...")
            
            # Wait a few seconds for services to start
            import time
            time.sleep(5)
            
            # Check if containers are running
            status = subprocess.run("docker-compose ps", shell=True, capture_output=True, text=True)
            print(status.stdout)
            
            print("\n✅ Services started successfully!")
            print("🌐 Opening frontend in browser...")
            
            # Open browser
            if os.name == 'nt':  # Windows
                subprocess.run("start http://localhost:3001", shell=True)
            elif sys.platform == 'darwin':  # macOS
                subprocess.run("open http://localhost:3001", shell=True)
            else:  # Linux
                subprocess.run("xdg-open http://localhost:3001", shell=True)
        else:
            print(f"\n⚠️  Command exited with code {result.returncode}")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    
    input("\nPress Enter to continue...")

def docker_stop():
    """Stop all Docker containers"""
    run_command("docker-compose down", "Stopping all services")

def docker_restart():
    """Restart all Docker containers"""
    run_command("docker-compose restart", "Restarting all services")

def docker_rebuild():
    """Rebuild and start containers"""
    run_command("docker-compose up -d --build", "Rebuilding and starting services")

def docker_status():
    """Check status of all containers"""
    run_command("docker-compose ps", "Container status")

def view_logs_all():
    """View logs from all containers"""
    print("\n📋 Viewing all logs (Press Ctrl+C to exit)...\n")
    try:
        subprocess.run("docker-compose logs -f", shell=True)
    except KeyboardInterrupt:
        print("\n\n✅ Stopped viewing logs")
    input("\nPress Enter to continue...")

def view_logs_backend():
    """View backend logs"""
    print("\n📋 Viewing backend logs (Press Ctrl+C to exit)...\n")
    try:
        subprocess.run("docker-compose logs -f backend", shell=True)
    except KeyboardInterrupt:
        print("\n\n✅ Stopped viewing logs")
    input("\nPress Enter to continue...")

def view_logs_frontend():
    """View frontend logs"""
    print("\n📋 Viewing frontend logs (Press Ctrl+C to exit)...\n")
    try:
        subprocess.run("docker-compose logs -f frontend", shell=True)
    except KeyboardInterrupt:
        print("\n\n✅ Stopped viewing logs")
    input("\nPress Enter to continue...")

def view_logs_db():
    """View database logs"""
    print("\n📋 Viewing database logs (Press Ctrl+C to exit)...\n")
    try:
        subprocess.run("docker-compose logs -f db", shell=True)
    except KeyboardInterrupt:
        print("\n\n✅ Stopped viewing logs")
    input("\nPress Enter to continue...")

def mysql_shell():
    """Open MySQL shell"""
    print("\n🗄️  Opening MySQL shell...")
    print("Password: rootpassword")
    print("Type 'exit' to quit MySQL shell\n")
    try:
        subprocess.run("docker exec -it banking_db mysql -uroot -prootpassword banking_sample", shell=True)
    except Exception as e:
        print(f"❌ Error: {e}")
    input("\nPress Enter to continue...")

def mysql_backup():
    """Backup MySQL database"""
    timestamp = subprocess.run("powershell -Command \"Get-Date -Format 'yyyyMMdd_HHmmss'\"", 
                               shell=True, capture_output=True, text=True).stdout.strip()
    backup_file = f"backup_{timestamp}.sql"
    
    command = f"docker exec banking_db mysqldump -uroot -prootpassword banking_sample > {backup_file}"
    print(f"\n💾 Creating backup: {backup_file}")
    
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✅ Backup created successfully: {backup_file}")
    except Exception as e:
        print(f"❌ Error creating backup: {e}")
    
    input("\nPress Enter to continue...")

def clean_volumes():
    """Stop containers and remove volumes"""
    print("\n⚠️  WARNING: This will delete all database data!")
    confirm = input("Are you sure? (yes/no): ").lower()
    
    if confirm == 'yes':
        run_command("docker-compose down -v", "Removing containers and volumes")
    else:
        print("❌ Operation cancelled")
        input("\nPress Enter to continue...")

def open_frontend():
    """Open frontend in browser"""
    print("\n🌐 Opening frontend in browser...")
    if os.name == 'nt':  # Windows
        subprocess.run("start http://localhost:3001", shell=True)
    elif sys.platform == 'darwin':  # macOS
        subprocess.run("open http://localhost:3001", shell=True)
    else:  # Linux
        subprocess.run("xdg-open http://localhost:3001", shell=True)
    input("\nPress Enter to continue...")

def show_urls():
    """Display application URLs"""
    clear_screen()
    print("\n" + "="*60)
    print(" 🔗 APPLICATION URLS")
    print("="*60)
    print(f"\n  Frontend:        http://localhost:3001")
    print(f"  Backend API:     http://localhost:3000/api")
    print(f"  MySQL:           localhost:3307")
    print(f"  DB User:         root")
    print(f"  DB Password:     rootpassword")
    print(f"  DB Name:         banking_sample")
    print("\n" + "="*60 + "\n")
    input("Press Enter to continue...")

def display_menu():
    """Display the main menu"""
    clear_screen()
    print("\n" + "="*60)
    print(" 🏦 BANKING APP - DOCKER MANAGEMENT MENU")
    print("="*60)
    print("\n  📦 DOCKER OPERATIONS:")
    print("    1.  Start all services")
    print("    2.  Stop all services")
    print("    3.  Restart all services")
    print("    4.  Rebuild and start")
    print("    5.  Check container status")
    print()
    print("  📋 LOGS:")
    print("    6.  View all logs")
    print("    7.  View backend logs")
    print("    8.  View frontend logs")
    print("    9.  View database logs")
    print()
    print("  🗄️  DATABASE:")
    print("    10. Open MySQL shell")
    print("    11. Backup database")
    print("    12. Clean volumes (⚠️  deletes data)")
    print()
    print("  🌐 BROWSER:")
    print("    13. Open frontend in browser")
    print("    14. Show application URLs")
    print()
    print("    0.  Exit")
    print("\n" + "="*60)

def main():
    """Main program loop"""
    
    # Check if docker-compose.yml exists
    if not os.path.exists('docker-compose.yml'):
        print("\n❌ Error: docker-compose.yml not found!")
        print("Please run this script from the project root directory.")
        input("\nPress Enter to exit...")
        sys.exit(1)
    
    menu_actions = {
        '1': docker_start,
        '2': docker_stop,
        '3': docker_restart,
        '4': docker_rebuild,
        '5': docker_status,
        '6': view_logs_all,
        '7': view_logs_backend,
        '8': view_logs_frontend,
        '9': view_logs_db,
        '10': mysql_shell,
        '11': mysql_backup,
        '12': clean_volumes,
        '13': open_frontend,
        '14': show_urls,
        '0': None
    }
    
    while True:
        display_menu()
        choice = input("\nEnter your choice: ").strip()
        
        if choice == '0':
            clear_screen()
            print("\n👋 Goodbye!\n")
            break
        elif choice in menu_actions:
            if menu_actions[choice]:
                menu_actions[choice]()
        else:
            print("\n❌ Invalid choice! Please try again.")
            input("\nPress Enter to continue...")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        clear_screen()
        print("\n\n👋 Goodbye!\n")
        sys.exit(0)
