import { Component, OnInit } from '@angular/core';

import { FamilyID } from 'src/app/models/FamilyID';
import { FamilyIdService } from 'src/app/services/family-id.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-family-id-table',
  templateUrl: './family-id-table.component.html',
  styleUrls: ['./family-id-table.component.scss'],
})
export class FamilyIdTableComponent implements OnInit {
  familyIDs: FamilyID[];
  familyID: FamilyID;
  showDeleteModal: boolean = false;
  itemId: string;
  itemFamilyIDValue: string;
  p: number = 1;
  numPerPage: number = 5;

  constructor(
    private familyIdService: FamilyIdService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.familyIdService.getFamilyIDs().subscribe((familyIDs) => {
      this.familyIDs = familyIDs;
      this.setTableSorting();
    });
  }

  setTableSorting() {
    setTimeout(() => {
      this.TableSorter.makeSortable(document.getElementById('family-id'));
    }, 2000);
  }

  // Table Sorter
  TableSorter = {
    makeSortable: function (table) {
      // Store context of this in the object
      var _this = this;
      var th = table.tHead,
        i;
      th && (th = th.rows[0]) && (th = th.cells);

      if (th) {
        i = th.length;
      } else {
        return; // if no `<thead>` then do nothing
      }

      // Loop through every <th> inside the header
      while (--i >= 0)
        (function (i) {
          var dir = 1;

          // Append click listener to sort
          th[i].addEventListener('click', function () {
            _this._sort(table, i, (dir = 1 - dir));
          });
        })(i);
    },
    _sort: function (table, col, reverse) {
      var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;

      reverse = -(+reverse || -1);

      // Sort rows
      tr = tr.sort(function (a, b) {
        // `-1 *` if want opposite order
        return (
          reverse *
          // Using `.textContent.trim()` for test
          a.cells[col].textContent
            .trim()
            .localeCompare(b.cells[col].textContent.trim())
        );
      });

      for (i = 0; i < tr.length; ++i) {
        // Append rows in new order
        tb.appendChild(tr[i]);
      }
    },
  };

  updateItemsPerPage(e) {
    this.numPerPage = e.target.value;
  }

  onDeleteFamilyIdClicked(val: string, familyIDValue: string) {
    this.itemId = val;
    this.itemFamilyIDValue = familyIDValue;
    this.modalToggle();
  }

  modalToggle() {
    this.showDeleteModal = !this.showDeleteModal;
  }

  modalDeleteResponse(res: boolean) {
    if (res) {
      this.modalToggle();
      this.familyIdService.deleteFamilyID(this.itemId);
      this.showToastrSuccess(
        'Success',
        `Family ID: ${this.itemFamilyIDValue} Successfully Deleted`
      );
    } else {
      this.modalToggle();
    }
  }

  showToastrSuccess(title: string, val: string) {
    this.toastr.success(`${val}`, `${title}`, {
      timeOut: 5000,
      positionClass: 'toast-top-left',
    });
  }

  showToastrError(title: string, val: string) {
    this.toastr.error(`${val}`, `${title}`, {
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
    });
  }
}
