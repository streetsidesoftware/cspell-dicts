/*
 * Original from [Import Statement in Java - GeeksForGeeks](https://www.geeksforgeeks.org/import-statement-in-java/#:~:text=An%20import%20statement%20tells%20the,is%20defined%20under%20a%20package.)
 */

// Java program to demonstrate the
// working of import statement

// Importing ArrayList class specified
// under java.util package
import java.util.ArrayList;
import java.util.Date;

class GFG {

    // Main method
    public static void main(String[] args) {
        // Declaring an ArrayList of String type
        ArrayList<String> arrayList = new ArrayList<String>();

        // Adding elements in the ArrayList
        arrayList.add("Geeks");
        arrayList.add("For");
        arrayList.add("Geeks");

        // Print the ArrayList
        System.out.println("ArrayList: " + arrayList);

        Date date = new Date();

        System.out.println("Date: " + date.toString());
    }
}
